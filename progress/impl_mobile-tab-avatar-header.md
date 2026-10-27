# Implementación mobile-tab-avatar-header (#222)

**Entrega:** cadena autorizada completada hasta C25; R12 pendiente de G4. Suite final 5745/5745, typecheck y lint verdes, Graphify actualizado. G2, G4 y las firmas de enmienda quedan al humano.

Primer comando ejecutado exactamente según handoff. Salida:
```text
/home/claude/sites/Pet-Tracker-wt-222
feature/222-mobile-tab-avatar-header
```

H0: `3b65fd09`. Sin init.sh, merge, rebase, push ni PR.

Skills cargadas: `building-native-ui`, `expo-tailwind-setup`, `appllama-app-design-skill`. Las dos de Expo se localizaron en el plugin instalado. No se buscaron los alias inexistentes `expo:expo-overview`, `expo-overview`, `expo-animation`, `expo-router`, `expo-design-system`. Sin MCP Appllama; diseño fijado por spec. La carta prevalece y G2 es del humano.

Esperas: `docs/conventions.md` §Esperas sobre el árbol renderizado: «Si el test asevera el árbol, espera al árbol».

Incidencia de invocación: `python` no está instalado; se corrigió a `python3` antes de ejecutar scripts, sin cambios de código.

## T0: anclas

```text
$ grep -cF 'testID="health-title"' screens/health/index.tsx                       # 1
1
$ grep -cF 'testID="food-title"' screens/food/index.tsx                           # 1
1
$ grep -cF 'testID="food-title-row"' screens/food/index.tsx                       # 1
1
$ grep -cF 'testID="profile-title"' screens/profile/index.tsx                     # 1
1
$ grep -cF 'variant="avatars"' screens/health/index.tsx                           # 1
1
$ grep -cF 'variant="avatars"' screens/food/index.tsx                             # 1
1
$ grep -cF 'variant="avatars"' screens/profile/index.tsx                          # 0
0
$ grep -cF "t('health.health')" screens/health/index.tsx                          # 1
1
$ grep -cF "t('food.food')" screens/food/index.tsx                                # 1
1
$ grep -cF "t('profile.profile')" screens/profile/index.tsx                       # 1
1
$ grep -cF 'tracking-title' screens/health/index.tsx                              # 1
1
$ grep -cF 'tracking-title' screens/food/index.tsx                                # 1
1
$ grep -cF 'tracking-title' screens/profile/index.tsx                             # 1
1
$ grep -cF 'testID="profile-add-pet"' screens/profile/index.tsx                   # 1
1
$ grep -cF 'testID="profile-hero-top"' screens/profile/index.tsx                  # 1
1
$ grep -cF 'testID="screen-food"' screens/food/index.tsx                          # 1
1
$ grep -cF 'testID="health-root"' screens/health/index.tsx                        # 1
1
$ grep -cF 'testID="food-root"' screens/food/index.tsx                            # 0
0
$ grep -cF 'testID="profile-hero-selector"' screens/profile/index.tsx             # 0
0
$ grep -cF 'testID="profile-top-row"' screens/profile/index.tsx                   # 0
0
$ grep -cF 'addPetCapsule' screens/profile/index.tsx                              # 0
0
$ grep -cF 'titleRow' screens/profile/index.tsx                                   # 3
3
$ ls components/tab-pet-header.tsx components/__tests__/tab-pet-header.test.tsx 2>&1 | grep -c 'No such file'   # 2
2
$ grep -cF 'flex-row gap-1.5' components/pet-switcher.tsx                         # 1
1
$ grep -cF "toBe('flex-row gap-1.5')" components/__tests__/pet-switcher.test.tsx  # 1
1
$ grep -cF 'edgeInset' components/pet-switcher.tsx                                # 0
0
$ grep -cF 'pet-switcher-scroll' components/pet-switcher.tsx                      # 0
0
$ grep -cF "'tabs.bar'" i18n/catalog.ts                                           # 2
2
$ grep -cF 'tabHeader.petsScroll' i18n/catalog.ts                                 # 0
0
$ grep -cF 'tabHeader' __tests__/ui-copy-table.ts                                 # 0
0
$ grep -cF '#222' __tests__/ui-copy-table.ts                                      # 0
0
$ grep -cF '#222' __tests__/hero-header-amendments.test.ts                        # 0
0
$ grep -rlF 'expo-blur' --include=*.tsx components screens | grep -v '\.test\.tsx' | sort   # components/floating-tab-bar.tsx screens/alert-detail/index.tsx screens/geofence-editor/index.tsx
components/floating-tab-bar.tsx
screens/alert-detail/index.tsx
screens/geofence-editor/index.tsx
$ grep -cF '**Regla N1 (enmienda #196)**' ../../docs/ui-guidelines.md             # 1
1
$ grep -cF '**Regla N1 (enmienda #222)**' ../../docs/ui-guidelines.md             # 0
0
$ grep -cE '^- \[[xX]\] G4 ' ../../specs/mobile-tab-avatar-header/requirements.md # 0   (G4 sin marcar: R12 queda bloqueado)
0
$ grep -cE '^- \[ \] G4 ' ../../specs/mobile-tab-avatar-header/requirements.md    # 1
1
$ grep -cF 'Excepción nombrada (enmienda #222' ../../docs/conventions.md          # 0
0
$ grep -cF 'Excepción nombrada' ../../docs/conventions.md                         # 5
5
$ grep -cF 'A20 de #181' ../../docs/conventions.md                                # 2
2
$ grep -cF 'pinta una ocurrencia del literal en cada fichero de pestaña' __tests__/tab-headers-canvas.test.ts   # 1
1
$ grep -cF 'limita el literal a las tres pestañas y a la celebración' __tests__/tab-headers-canvas.test.ts      # 1
1
$ grep -cF '#196 R11: la carta recoge la enmienda N1 de #196' __tests__/tab-headers-canvas.test.ts               # 1
1
$ grep -cF "'screens/food/index.tsx', 'components/celebration.tsx', 'screens/health/index.tsx', 'screens/profile/index.tsx'" __tests__/canvas-foundations.test.ts   # 1
1
$ grep -cF "toEqual(['screens/food/index.tsx', 'screens/health/index.tsx'])" __tests__/profile-canvas-fidelity.test.ts   # 1
1
$ grep -cF 'n: 3,' __tests__/profile-photo-hero-canvas.test.ts                    # 1
1
$ grep -cF 'toHaveLength(24)' __tests__/profile-photo-hero-canvas.test.ts         # 1
1
$ grep -cF "'screens/profile/index.tsx'," __tests__/alerts-canvas-fidelity.test.ts   # 2
2
$ grep -cF 'reparte los cinco colores y vuelve a ámbar en la sexta mascota' components/__tests__/pet-switcher.test.tsx   # 1
1
$ grep -cF 'pinta el título grande ($name)' screens/health/index.test.tsx         # 1
1
$ grep -cF 'pinta el título grande ($name)' screens/food/index.test.tsx           # 1
1
$ grep -cF 'pinta el título grande ($name)' screens/profile/index.test.tsx        # 1
1
$ grep -cF '#199 R12 health-header es una fila justify-between que empieza por health-title' screens/health/index.test.tsx   # 1
1
$ grep -cF '#199 R13 el selector va en health-header tras health-title en su variante avatars' screens/health/index.test.tsx   # 1
1
$ grep -cF '#200 R2: los avatares comparten fila con el título' screens/food/index.test.tsx                                   # 1
1
$ grep -cF '#200 R2: sin mascotas la fila solo lleva el título' screens/food/index.test.tsx                                   # 1
1
$ grep -cF '#196 R5: con el permiso bloqueado y sin hero el aviso va tras el título' screens/profile/index.test.tsx            # 1
1
$ grep -cF 'pasa avatars al selector compartido cuando carga la mascota' screens/profile/index.test.tsx                       # 1
1
$ grep -rlP '(?<![\w-])(health-title|food-title-row|food-title|profile-title)(?![\w-])' . --include=*.ts --include=*.tsx | sort | tr '\n' ' '   # screens/food/index.test.tsx screens/food/index.tsx screens/health/index.test.tsx screens/health/index.tsx screens/profile/index.test.tsx screens/profile/index.tsx
./screens/food/index.test.tsx ./screens/food/index.tsx ./screens/health/index.test.tsx ./screens/health/index.tsx ./screens/profile/index.test.tsx ./screens/profile/index.tsx
$ grep -cF -e '- **R1.1**' ../../specs/mobile-tab-headers-canvas/requirements.md                       # 1
1
$ grep -cF -e '- **R2.1**' ../../specs/mobile-profile-photo-hero-canvas/requirements.md                # 1
1
$ grep -cF -e '**R12 — Cabecera de Salud.**' ../../specs/mobile-canvas-health-weight/requirements.md   # 1
1
$ grep -cF -e '### R2 — Marco y fila de título' ../../specs/mobile-canvas-nutrition/requirements.md    # 1
1
$ grep -cF -e '- **R4**' ../../specs/mobile-canvas-foundations/requirements.md                         # 1
1
$ grep -cF -e '- **R4.3**' ../../specs/mobile-tab-screens-canvas-fidelity/requirements.md              # 1
1
$ grep -cF 'Enmienda #222' ../../specs/mobile-tab-headers-canvas/requirements.md ../../specs/mobile-profile-photo-hero-canvas/requirements.md ../../specs/mobile-canvas-health-weight/requirements.md ../../specs/mobile-canvas-nutrition/requirements.md ../../specs/mobile-canvas-foundations/requirements.md ../../specs/mobile-tab-screens-canvas-fidelity/requirements.md | grep -vc ':0$'   # 0
0
$ grep -c '^\s*it(' components/__tests__/pet-switcher.test.tsx                    # 10
10
$ grep -c '^\s*it(' screens/health/index.test.tsx                                 # 63
63
$ grep -c '^\s*it(' screens/food/index.test.tsx                                   # 68
68
$ grep -c '^\s*it(' screens/profile/index.test.tsx                                # 87
87
$ grep -c '^\s*it(' __tests__/tab-headers-canvas.test.ts                          # 8
8
$ grep -c '^\s*it(' __tests__/hero-header-amendments.test.ts                      # 6
6
$ grep -c '^\s*it(' __tests__/ui-language.test.ts                                 # 31
31
$ test ! -e .expo/types/router.d.ts && echo sin-router-d-ts
sin-router-d-ts
```

T0: exit 0, cero FAIL. `Test Suites: 160 passed, 160 total`; `Tests: 5704 passed, 5704 total`. N = 5704. Worker force-exit preexistente, permitido por handoff. El listado grep de rutas incluye el prefijo convencional `./`; los seis ficheros coinciden.

## Cadena

C1: 5704 + 4 - 0 = 5708 (N+4). Alcance: `Tests: 4 failed, 199 passed, 203 total`, solo 4 aserciones esperadas (reescrito + tres nuevos). Typecheck 0. Nace verde `#222 R2: las variantes default y glass no cambian`; mutación `pet-switcher-scroll` solo en glass: `Tests: 1 failed, 18 skipped, 19 total`, revertida byte a byte. Una guarda aplazó la sonda mientras #214 ejecutaba Jest; no se lanzó concurrentemente. Logs `test-222-c1.log`, `mutation-222-c1.log`, `typecheck-222-c1.log`.

C2: 5708 + 0 - 0 = 5708. `Tests: 203 passed, 203 total` (7 suites). Typecheck 0. B11/B12 = 0; default y glass idénticos byte a byte a H0. Sonda restaurando gap-1.5: `Tests: 1 failed, 18 skipped, 19 total`, por la aserción de fila; revertida. Logs `test-222-c2.log`, `mutation-222-c2.log`, `typecheck-222-c2.log`.

C3: 5708 + 1 - 0 = 5709 (N+5). `Tests: 1 failed, 203 passed, 204 total`; único rojo: valor undefined frente al literal es. Typecheck 0. Solo it de copy, sin tabla ni sumas.

## Reanudación con adenda 1

HEAD de reanudación: e1e7193b. El leader amplió el alcance con el único it de recuento del provider (C3b). La parada anterior queda resuelta por esa adenda; C4 se reintentará tras su rojo. Se conservan T0 y C1–C3, sin repetirlos. Skills ya cargadas en esta conversación: building-native-ui, expo-tailwind-setup y appllama-app-design-skill; ninguna faltaba.

C3b: 5709 + 0 - 0 = 5709 (N+5). `Tests: 2 failed, 256 passed, 258 total`; rojo del provider: espera 485 y recibe 484. El otro rojo es el copy pendiente de C3. Typecheck 0. Solo se modificó el it de recuento autorizado.

C4: 5709 + 0 - 0 = 5709. `Tests: 258 passed, 258 total` (8 suites), incluidos provider y copy. Typecheck 0. B20 = 2, B21 = 2; el provider exige y obtiene 485 claves.

C5: 5709 + 6 - 0 = 5715 (N+11). `Tests: 1 failed, 257 passed, 258 total`; L5 falla por su aserción. La suite nueva de seis it no se registra por import inexistente (excepción prevista), no por SIGKILL. Typecheck 2 exclusivamente TS2307 del mismo módulo pendiente.

C6: 5715 + 0 - 0 = 5715. `Tests: 264 passed, 264 total` (9 suites). Typecheck 0. B7 = 1. Sonda padding +8: `Tests: 1 failed, 5 skipped, 6 total`, diferencia 48 frente a 47; revertida.

C7: 5715 + 12 - 0 = 5727 (N+23). `Tests: 34 failed, 674 passed, 708 total`; 12 nuevos de encabezados, 18 ramas reescritas y cuatro ramas con hero del orden de Perfil. Rojos por aserciones/nodos ausentes previstos. Un matcher de orden comparaba nodos circulares en su rojo; se hizo la misma aserción sobre testID para permitir serializar el fallo. El retry terminó registrando las 708 pruebas (sin suite perdida). Typecheck 0 tras esa corrección. Esperas documentadas con docs/conventions.md §Esperas en los tests.

C8: 5727 + 0 - 0 = 5727. `Tests: 708 passed, 708 total` (11 suites). Typecheck 0. B8/B9/B10 = 1. Food-root envuelve el scroll sin reindentar; los títulos visibles se conservan hasta sus R.

C9: 5727 + 5 - 3 = 5729 (N+25). `Tests: 26 failed, 362 passed, 388 total`; rojos R3, R9.1, L1/L2/L5/L8 y copy de Salud. Typecheck 0. Tras eliminar sus dos it se retiró también el describe R12 vacío (Jest veta beforeEach sin tests); se verificó de nuevo sin errores de ejecución. L4 reducido a consumidores restantes. La fila R8 de Salud y su +1 entran aquí.

C10: 5729 + 0 - 0 = 5729. `Tests: 388 passed, 388 total` (9 suites). Typecheck 0. B1/B5/B13 Salud = 0; t(tabHeader.petsScroll) = 1. Sondas de orden (cabecera antes del scroll) y umbral >=6: cada una `Tests: 1 failed, 129 skipped, 130 total`; ambas revertidas.

C11: 5729 + 5 - 1 = 5733 (N+29). `Tests: 19 failed, 369 passed, 388 total`; rojos R4/R9.1, L1/L2/L5/L8 y copy de Nutrición. Typecheck 0. Se conserva reescrito el it sin mascotas; fila R8 de Nutrición y su +1 añadidos en este rojo.

C11b (corrección propia de aserción R4): 5733 + 0 - 0 = 5733. RNTL 14 compara texto completo: el cambio de mascota pintaba correctamente «777 kcal / día»; la expectativa parcial «777» del it nuevo era incorrecta. Se corrigió solo esa expectativa, se retiró temporalmente la implementación aún sin commit y se verificó de nuevo el rojo: `Tests: 19 failed, 369 passed, 388 total`. Typecheck 0. Commit solo de tests antes del verde C12; sin cambios de spec ni del contenido de Nutrición.

C12: 5733 + 0 - 0 = 5733. `Tests: 388 passed, 388 total` (9 suites). Typecheck 0. B2/B3/B6 = 0, B16 = 1; t(tabHeader.petsScroll) = 1. El cambio de mascota desde la cabecera actualiza el objetivo visible a 777 kcal / día.

C13: 5733 + 2 - 0 = 5735 (N+31). `Tests: 6 failed, 450 passed, 456 total`; fila nueva y cinco ramas/avisos sin hero reescritos. Typecheck 0. Nace verde el it paddingTop 52 (la receta ya existía); sonda +13: `Tests: 1 failed, 197 skipped, 198 total`, revertida. R9.1: se adelantan desde la lista de C15 las dos ramas sin hero del it.each #196 R1 y el it R5.2/R5.3 de vacío, pues caerían en C14. Su espera a caché se sustituye por me-card-state renderizado (§Esperas).

C14: 5735 + 0 - 0 = 5735. `Tests: 456 passed, 456 total` (9 suites). Typecheck 0. addPetCapsule se comparte; titleRow queda solo para el hero. Sonda sin justify-end: `Tests: 1 failed, 197 skipped, 198 total`, revertida. D12: una ocurrencia de cada fondo de cápsula.

C15: 5735 + 4 - 2 - 1 (fila n:3 de FILAS) = 5736 (N+32). `Tests: 12 failed, 445 passed, 457 total`; cuatro it nuevos R5 rojos, cuatro ramas de título y los candados L1/L2/L8 y slot pendiente. Typecheck 0. FILAS baja 24→23, n:4 de la cápsula queda intacta. Las reescrituras del vacío ya se habían hecho en C13.

C16: 5736 + 0 - 0 = 5736. `Tests: 457 passed, 457 total` (9 suites). Typecheck 0. B4=0, B14/B15=1, titleRow=0, t(profile.profile)=1. Sonda de orden cápsula/selector invertido: `Tests: 1 failed, 199 skipped, 200 total`, revertida. D12 conserva una ocurrencia de cada fondo.

C17: 5736 + 3 - 0 = 5739 (N+35). `Tests: 260 passed, 260 total` (8 suites). Typecheck 0. Los tres it R10 nacen verdes porque R2–R6 ya quitaron los títulos/avatars de las pantallas. Cada sonda (health-title en producción, variant="avatars" en Salud, StyleSheet en TabPetHeader) dio `Tests: 1 failed, 10 skipped, 11 total`, por su candado y se revirtió. Anclas negativas probadas ANTES de filesMatching (negative-anchors-222.log): health-title/food-title/food-title-row/profile-title=true; edit-profile-title/nutrition-profile-title=false. También se fijan esas seis cadenas en el it.

R14.1: diff completo contra H0 revisado a mano. Solo imports del componente, región de cabecera/heading/padding, cabeceras tras scroll, constante addPetCapsule y primer hijo de profile-content. Sin cambios interiores protegidos ni reindentación del scroll de Nutrición. Hunks (unified=0):

```diff
diff --git a/mobile-pet-tracker/src/screens/food/index.tsx b/mobile-pet-tracker/src/screens/food/index.tsx
@@ -21 +21 @@ import { EmptyState } from '../../components/empty-state';
@@ -156,0 +157,2 @@ export function FoodScreen() {
@@ -164 +166 @@ export function FoodScreen() {
@@ -168,13 +169,0 @@ export function FoodScreen() {
@@ -473,0 +463,11 @@ export function FoodScreen() {
diff --git a/mobile-pet-tracker/src/screens/health/index.tsx b/mobile-pet-tracker/src/screens/health/index.tsx
@@ -13 +13 @@ import { EmptyState } from '../../components/empty-state';
@@ -105,0 +106 @@ export function HealthScreen() {
@@ -113 +114 @@ export function HealthScreen() {
@@ -117,13 +117,0 @@ export function HealthScreen() {
@@ -356,0 +345,10 @@ export function HealthScreen() {
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -274,5 +274 @@ export function ProfileScreen() {
@@ -297 +292,0 @@ export function ProfileScreen() {
@@ -309,0 +305 @@ export function ProfileScreen() {
@@ -324,10 +320,12 @@ export function ProfileScreen() {
@@ -356 +354 @@ export function ProfileScreen() {
```

C18: 5739 + 2 - 0 = 5741 (N+37). `Tests: 262 passed, 262 total` (8 suites). Typecheck 0. Los dos it R14 nacen verdes: son guardas del reparto ya respetado. Sondas renombrando vaccines-add y llamando t(x) en TabPetHeader: cada una `Tests: 1 failed, 12 skipped, 13 total`, revertidas. El candado SCREEN_FILES de ui-language se conserva sin cambios. Hunks de R14.1 arriba.

C19: 5741 + 0 - 0 = 5741. `Tests: 392 passed, 392 total` en alcance Nutrición+candados y `Tests: 392 passed, 392 total` en Salud+candados. Typecheck 0. El grep solo encontró, además de aserciones negativas, el ID en el título normativo del it R4. Se dividió ese literal en dos fragmentos conservando el título ejecutado y se añadió el sufijo R9; no cambian aserciones. También se completa el sufijo R9 del selector R3 reescrito. Ahora todas las coincidencias .tsx son queryByTestId(...).toBeNull(), sin producción; cero getByText de los seis títulos antiguos. L3 se conserva por G4 pendiente.

Primera corrida de preflight C20 (previa a la adenda 2): apareció el flake conocido #200 R9 de Nutrición (meals-history-link, router.push con 0 llamadas), listado en el handoff. El describe #200 R9 completo se comparó byte a byte con H0 y es idéntico. No se modifica. Se verificará aislado al terminar la corrida, conforme a la regla de carga.

## Reanudación con adenda 2

HEAD inicial: e5e4f1cc. El leader aprobó la actualización del único it.each del placeholder de Perfil (C19b). La parada anterior queda resuelta; se mantiene el rojo histórico en isolated-222-c20-tabs.log. Se conservaron N=5704, la cadena C1–C19 y sus sondas. Skills ya cargadas en esta conversación: building-native-ui, expo-tailwind-setup y appllama-app-design-skill; ninguna faltaba y no se cargan otras.

C19b: 5741 + 0 - 0 = 5741 (N+37). `Tests: 1 skipped, 1 passed, 2 total` en el it aislado; `Tests: 262 passed, 262 total` en los ocho candados. Typecheck 0. Pasa en verde de inmediato por los cambios C8/C16; excepción rojo-primero aprobada en adenda 2: el rojo previo está en isolated-222-c20-tabs.log y en full-222-c20-before-adenda2.log (2 failed, 5739 passed, 5741 total). Solo cambian el título y getByText→getByRole del it.each; el setup, la ruta y el segundo it quedan intactos.

Preflight C20 repetido tras C19b: exit 0, cero FAIL. `Test Suites: 161 passed, 161 total`; `Tests: 5741 passed, 5741 total` (N+37), snapshot 1/1. Log full-222-c20.log. El aviso de worker force-exit es el preexistente permitido.

C20: 5741 + 3 - 0 = 5744 (N+40). `Tests: 3 failed, 268 passed, 271 total` (un fallo de aserción por bloque, firma y marcador ausentes); Typecheck 0. AMENDED_DOCS_222 tiene seis filas mientras G4=0, aunque el título normativo del primer it diga siete: desviación prescrita por el handoff. Ningún error de import.

C21: 5744 + 0 - 0 = 5744. `Tests: 271 passed, 271 total` (9 suites), Typecheck 0. Solo se añaden el marcador propio y el bloque canónico en las seis specs; se verificó que el texto original no cambia. Las seis firmas #222 quedan sin marcar. Sonda eliminando el bloque de mobile-tab-headers-canvas: `Tests: 1 failed, 8 skipped, 9 total`; restauración comprobada por SHA-256.

C22: G4 medido con el grep prescrito = 0. Se omite R12 y no hay commit de carta; docs/ui-guidelines.md, L3 y AMENDED_DOCS_168 quedan intactos. R12 pendiente: G4. Se continúa C23 según handoff; R13 no requiere G4.

C23: 5744 + 1 - 0 = 5745 (N+41). `Tests: 1 failed, 271 passed, 272 total`; único rojo: falta el literal de la excepción en conventions.md. Typecheck 0.

C24: 5745 + 0 - 0 = 5745. `Tests: 272 passed, 272 total` (9 suites). Typecheck 0. conventions.md solo gana el párrafo literal R13.1 entre fidelidad al canvas y A20. R13 se entrega sin G4 por la excepción expresa del handoff.

Cierre previo a C25: lint exit 0 y lint-222.log de 0 bytes (`bunx expo lint --no-cache` y test ! -s). `graphify update .` exit 0: 2623 archivos procesados por AST; grafo de 30717 nodos y 39528 aristas, 2008 comunidades, sin LLM. Limitación del log: 22 archivos SQL omitidos por faltar tree_sitter_sql; no se instalaron dependencias. Artefactos en graphify-out/ ignorado.

C25: trazabilidad enlazada a los hashes rojos/verdes; 39 casillas entregadas marcadas, las tres de R12 sin marcar. G2/G4 y las seis firmas humanas nuevas se conservan sin marcar. Se mantiene feature_list.json y el bookkeeping del leader.

## Commits (hash y mensaje)

```text
0194c067 docs(#222): handoff to Codex
a863a878 docs(#222): handoff diff excludes the handoff commit
41468ca1 test(mobile): PetSwitcher avatars row without gap, edgeInset and scrollHint (R2)
a3a35499 feat(mobile): PetSwitcher avatars row without gap, edgeInset and scrollHint (R2)
6bff6229 test(mobile): tabHeader.petsScroll copy in both languages (R8)
e1e7193b docs(harness): #222 handoff adenda 1, recuento de claves del provider en C3b
b310bf02 test(mobile): provider key count includes tabHeader.petsScroll (R8)
939d057d feat(mobile): tabHeader.petsScroll copy in both languages (R8)
293a41eb test(mobile): TabPetHeader fixed avatar header (R1)
8c5b5981 feat(mobile): TabPetHeader fixed avatar header (R1)
7d38baab test(mobile): visually hidden screen-reader headings (R7)
16a33551 feat(mobile): visually hidden screen-reader headings (R7)
43439700 test(mobile): Health without title and with fixed avatar header (R3)
82db8291 feat(mobile): Health without title and with fixed avatar header (R3)
8148f54f test(mobile): Food without title and with fixed avatar header (R4)
d50782fa test(mobile): assert rendered nutrition target after pet selection (R4)
074304a0 feat(mobile): Food without title and with fixed avatar header (R4)
09acdb5a test(mobile): Profile without hero keeps a top row with the add-pet capsule (R6)
3fe62f91 feat(mobile): Profile without hero keeps a top row with the add-pet capsule (R6)
205cd084 test(mobile): Profile hero top row with selector and add-pet capsule, no title (R5)
68dba5b6 feat(mobile): Profile hero top row with selector and add-pet capsule, no title (R5)
15ff0432 test(mobile): grep-clean tab headers (R10)
c5594342 test(mobile): file split guards (R14)
32598e1d test(mobile): last locks amended (R9)
e5e4f1cc docs(harness): #222 handoff adenda 2, placeholder de Perfil en screens.test.tsx (C19b)
c4402dab test(mobile): Perfil placeholder asserts its header role (R9)
8bdc8cb1 test(mobile): amendment blocks in the six specs (R11)
2886ac98 feat(mobile): amendment blocks in the six specs (R11)
7378a646 test(mobile): conventions exception for the fixed header (R13)
10756947 feat(mobile): conventions exception for the fixed header (R13)
```

C25 es el presente commit `docs(mobile): traceability and report (R1-R14)`; su hash final se entrega en la respuesta, para no reescribir este documento después de fijar trazabilidad. No se hizo rebase ni amend.

## Trazabilidad R1–R14

| R | Test principal y evidencia | Test | Implementación / verde |
|---|---|---|---|
| R1 | Seis it de tab-pet-header.test.tsx; receta, constantes y props literales; sonda +8 | 293a41eb | 8c5b5981 |
| R2 | Cuatro it de pet-switcher.test.tsx y L9; sondas glass y gap | 41468ca1 | a3a35499 |
| R3 | Seis it de Salud, R9.1, sondas orden y umbral | 43439700; sufijo 32598e1d | 82db8291 |
| R4 | Cinco it de Nutrición, R9.1, cambio de mascota visible | 8148f54f, d50782fa; título 32598e1d | 074304a0 |
| R5 | Cuatro it de Perfil con hero, ausencia de título en todas las ramas y sonda de orden | 205cd084 | 68dba5b6 |
| R6 | Dos it sin hero, casuística vacía/error y sondas padding/justify-end | 09acdb5a | 3fe62f91 |
| R7 | Cuatro it por pantalla y las 18 ramas reescritas, encabezado y traducción | 7d38baab | 16a33551 |
| R8 | Copy ES/EN, provider 485, filas y sumas de uso | 6bff6229, b310bf02, 43439700, 8148f54f | 939d057d; llamadas 82db8291/074304a0 |
| R9 | L1/L2/L4/L5/L6/L8/L9/L10; L7 intacto; integración del placeholder con adenda 2 | Incrementales + 32598e1d, c4402dab | Verdes R1–R8; L3 permanece en R12 |
| R10 | Tres it grep-limpio, seis cadenas plantadas y tres mutaciones | 15ff0432 | Previo: 8c5b5981/82db8291/074304a0/68dba5b6 |
| R11 | Tres it de bloques, firma y marcador; seis specs (G4=0), sonda de bloque ausente | 8bdc8cb1 | 2886ac98 |
| R12 | Carta N1 y L3 | pendiente: G4 | Sin commit; carta y AMENDED_DOCS_168 intactos |
| R13 | Literal de excepción de convenciones | 7378a646 | 10756947 |
| R14 | Dos it de reparto, dos mutaciones; diff H0 y comparación de interiores | c5594342 | Previo: 8c5b5981/82db8291/074304a0/68dba5b6 |

La tabla detallada versionada en specs/mobile-tab-avatar-header/traceability.md incluye nombres y mensajes de commits. Tasks.md marca 39 casillas entregadas; las tres de R12 siguen sin marcar. Frontmatter de specs y feature_list.json quedan en manos del leader.

## Verificación final

C25: 5745 + 0 - 0 = 5745 (N+41). Suite completa final exit 0, cero FAIL; cubre todos los candados requeridos, ambos componentes y las tres pantallas, incluido el placeholder de integración. `progress/final-test-222.log` y `progress/full-222-c25.log` contienen la misma corrida, sin pipe:

```text
Test Suites: 161 passed, 161 total
Tests:       5745 passed, 5745 total
Snapshots:   1 passed, 1 total
```

La única advertencia de cierre de workers es la preexistente permitida por el handoff. No hubo pérdida de suites por SIGKILL. El preflight C20 tras la adenda 2 también terminó completamente verde (5741/5741); la guarda del placeholder queda resuelta.

- Lint: exit 0 con `bunx expo lint --no-cache` y `test ! -s`; progress/lint-222.log tiene 0 bytes.
- Typecheck C25: exit 0; antes se comprobó que .expo/types/router.d.ts no existe. El único rojo de tipos de la cadena fue el import previsto en C5, resuelto en C6.
- Graphify: `graphify update .`, exit 0, AST sin LLM; 2623 archivos, 30717 nodos, 39528 aristas y 2008 comunidades. Sus artefactos quedan ignorados en graphify-out/. El log indica 22 archivos SQL omitidos por el parser opcional ausente; no se instalaron dependencias.
- Git diff --check sin incidencias. Alcance final: 32 ficheros, todos en la lista cerrada ampliada por adendas 1/2 y el handoff. Se contrasta la lista contra git diff --name-only 3b65fd09..HEAD después del commit C25.
- Comparación byte a byte contra H0: interiores protegidos de Salud, Nutrición y Perfil intactos, así como PetSwitcher default/glass. Los hunks R14.1 están arriba; no se reindentó el scroll de Nutrición.
- Sin cambios en package.json, bun.lock, theme/, backend, test/jest-setup.js, app/_layout.tsx, la carta, los requirements/design de #222, feature_list.json, STATUS.md ni progress/current.md/history.md. En app/ solo cambian las dos líneas autorizadas de C19b; en providers/ solo el it autorizado en C3b. No se regeneraron env ni node_modules.
- Sin init.sh, EAS, AWS real, merge, rebase, push ni PR. El leader ejecuta init.sh y gestiona integración en dev.

## Anclas, sondas y desviaciones

- T0 y todas sus salidas se conservan arriba. Anclas finales: B1–B6 = 0; B7 = 1; B8–B10 = 1; B11/B12 = 0; B13 = 0 en las tres pantallas; B14–B16 = 1; B20 = 2; B21 = 2. B17 = 1 y B18 = 0 porque G4 sigue pendiente. B19 conserva exactamente floating-tab-bar, alert-detail y geofence-editor.
- El grep final de IDs solo encuentra queryByTestId(...).toBeNull() en tests; nada en producción. Cero getByText de Salud/Nutrición/Perfil/Health/Food/Profile. SCREEN_FILES y ALL_USES no cambian. Ui-copy-table solo gana dos filas R8; el catálogo solo gana una clave por idioma junto a tabs.bar.
- Sondas de tests que nacieron verdes: R2 default/glass, R6 paddingTop 52, los tres R10 y los dos R14. Todos detectaron su mutación y se restauraron. R10 se probó primero contra las seis cadenas plantadas, incluidas las dos exclusiones, antes de aplicarlo a producción. C19b nació verde con excepción explícita de la adenda 2, sustentada por su rojo previo aislado.
- Otras sondas: gap de R2, padding +8 de R1, orden y umbral de Salud, justify-end sin hero, orden selector/cápsula del hero y bloque ausente de R11. Resultados y logs por paso arriba. Ninguna mutación permanece.
- Orden R6 antes de R5, según handoff. C13 reescribe antes las aserciones R9.1 que usan la rama sin hero; el grep halló el it de centro/vacío y las ramas sin hero del it.each #196 R1. C11b corrige la expectativa propia de texto completo en RNTL 14, con commit de tests separado. C19 completa el barrido de IDs y sufijos.
- Adenda 1 resuelve el recuento del provider mediante C3b antes de C4. Adenda 2 resuelve el placeholder de Perfil mediante C19b. Las paradas anteriores quedan resueltas. El flake antiguo #200 R9 de Nutrición se documentó y pasó aislado; no se modificó ese describe, que sigue idéntico a H0.
- R11 usa seis documentos mientras G4=0, aunque el título literal del primer it diga siete. Las seis firmas nuevas quedan sin marcar. R12 se omite tras medir G4=0; R13 se entrega porque el handoff aclara que conventions.md no está sujeto a ese gate.
- Skills cargadas: building-native-ui, expo-tailwind-setup y appllama-app-design-skill. Ninguna de las tres faltaba. No se cargaron otras ni se buscaron los alias declarados inexistentes en el handoff. La carta prevaleció; no se usó el MCP Appllama ni el simulator loop, sustituido por G2 humano.

## Ficheros finales desde H0

```text
docs/conventions.md
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/profile-photo-hero-canvas.test.ts
mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/screens.test.tsx
mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx
mobile-pet-tracker/src/components/__tests__/tab-pet-header.test.tsx
mobile-pet-tracker/src/components/pet-switcher.tsx
mobile-pet-tracker/src/components/tab-pet-header.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/food/index.test.tsx
mobile-pet-tracker/src/screens/food/index.tsx
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
mobile-pet-tracker/src/screens/profile/index.test.tsx
mobile-pet-tracker/src/screens/profile/index.tsx
progress/handoff_mobile-tab-avatar-header.md
progress/impl_mobile-tab-avatar-header.md
specs/mobile-canvas-foundations/requirements.md
specs/mobile-canvas-health-weight/requirements.md
specs/mobile-canvas-nutrition/requirements.md
specs/mobile-profile-photo-hero-canvas/requirements.md
specs/mobile-tab-avatar-header/tasks.md
specs/mobile-tab-avatar-header/traceability.md
specs/mobile-tab-headers-canvas/requirements.md
specs/mobile-tab-screens-canvas-fidelity/requirements.md
```

## Smoke y firmas reservados al humano

Pendiente G2: (a) cabecera fija con scroll por debajo en claro y oscuro; (b) separación 10 y último chip cortado con 8 o más mascotas; (c) TalkBack anuncia Salud/Nutrición/Perfil y la pista con 7 o más mascotas; (d) salto del contenido al cargar la lista. Pendiente G4: enmienda N1 de la carta (R12). El humano marca las seis firmas de los bloques ya introducidos y, tras G4 y R12, la del bloque de la carta. No se marcó ninguna casilla humana.

La entrega de la cadena autorizada no declara #222 done: su cierre sigue esperando G2/G4 y R12. El marcador .done se recrea al terminar C25 con la ruta de este reporte.
