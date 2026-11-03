# Implementación #235 — mobile-profile-photo-owner-only

**PARA en M7: contradicción de la spec.** La implementación y los 219 tests de Perfil están verdes en `7a769ff2`; M1–M7 se detectan y están revertidas. No se completó el cierre: M8, M9, guardas, tipos, lint y trazabilidad quedan sin ejecutar/rellenar por la orden explícita del handoff de parar ante contradicciones. No se declara `done`.

Worktree: `/home/claude/sites/Pet-Tracker-wt-235`.
Branch: `feature/235-mobile-profile-photo-owner-only`. Base H0: `03701fdb`.
Integración a cargo del leader en `dev`; no se ejecuta `./init.sh` ni se abre PR.

## Entrada y anclas

Comando de identidad indicado por el handoff:

```sh
cd /home/claude/sites/Pet-Tracker-wt-235 && pwd && git branch --show-current && git log --oneline -3
```

```text
/home/claude/sites/Pet-Tracker-wt-235
feature/235-mobile-profile-photo-owner-only
c5c12a1c docs(progress): #235 codex handoff
03701fdb chore(spec): firma delegada #235 (mandato del humano 2026-10-23, ampliado 2026-11-03)
6ad5141f docs(spec): #235 mobile-profile-photo-owner-only EARS spec (draft)
```

Este comando se ejecutó tras la lectura inicial del handoff y un `git status --short --branch && pwd`, no como primer comando literal de la sesión. El árbol inicial estaba limpio.

Anclas medidas antes de editar (recuento literal y condición inmediatamente anterior al BubblePop):

| Ancla | Antes |
|---|---:|
| `isOwner` en producción | 0 |
| `myRole` en producción | 0 |
| `BubblePop testID="profile-change-photo-pop"` | 1 |
| `testID="change-photo"` | 1 |
| `signOut(` | 2 |
| condición vieja `{pet ? (` inmediatamente antes del BubblePop | 1 |
| `myRole` en tests | 1 |
| `#235` en producción / tests | 0 / 0 |

`.env` y `mobile-pet-tracker/node_modules` existen. `.expo/types/router.d.ts` no existe.
No se ejecutaron fetch, merge, rebase ni instalación de dependencias.

## Reglas y skills

Leídos los cuatro documentos de la spec y las reglas relevantes de arquitectura, convenciones, UI, verificación y CHECKPOINTS.
Skills cargadas: `ponytail`, `building-native-ui` (en `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`) y `appllama-app-design-skill`.
Consultada la documentación versionada requerida por `mobile-pet-tracker/AGENTS.md`: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).

Se aplica [docs/conventions.md §Esperas sobre el árbol renderizado](../docs/conventions.md#esperas-sobre-el-árbol-renderizado): «Si el test asevera el árbol, espera al árbol». Toda ausencia nueva se ancla en un nodo positivo del escenario; R3 Test A espera `profile-pet-name` con texto `Milo` antes del `null`. No se espera a contadores de mocks.

## Ejecución

1. R1 rojo: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx -t "#235 R1"` desde `mobile-pet-tracker/`, exit 1. Una suite roja; 3 fallidos (`family`, `walker`, `vet`), 1 aprobado (`owner`), 212 omitidos, 216 totales; 85.499 s. Los tres fallan por `expect(screen.queryByTestId('change-photo', { includeHiddenElements: true })).toBeNull()`: se recibe el botón montado. No hay fallo de importación ni de resolución de módulos.
   Commit solo de tests: `f86afbb013d0688d8c6cd85b7df04f10f55e3caf` — `test(mobile): #235 profile camera only for the owner (R1)`.
   Nace verde: fila `owner`, porque la cámara ya se pinta al dueño antes del cambio.

2. R3 rojo: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx -t "#235 R3" --silent`, exit 1. Una suite roja; 2 fallidos (Test A y lista `owner` / detalle `family`), 1 aprobado (lista `family` / detalle `owner`), 216 omitidos, 219 totales; 6.892 s. Ambos rojos son por `toBeNull()` con el botón montado; Test A ya había esperado el nombre `Milo` en el árbol. No hay errores de imports ni módulos.
   Commit solo de tests: `6e9d07e0128dc0ef52dff336eb7b7e551a1dacd8` — `test(mobile): #235 profile camera follows the selected pet (R3)`.
   Nace verde: lista `family` / detalle `owner`, porque la cámara anterior se pinta con cualquier detalle resuelto, incluido el dueño.

Se añade `--silent` a las corridas posteriores para omitir los avisos repetidos de SVG sobre tokens de color; las aserciones y los resúmenes de Jest permanecen visibles.
3. Verde común: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`, exit 0; 1 suite, 219/219 tests aprobados, 0 snapshots; 26.870 s. Baseline 212 tests, delta +7 (R1: 4; R3: 3). Tests previos intactos. El diff de producción contra H0 es exactamente `2 1`; el de tests, `74 0`.
   Commit solo de producción: `7a769ff21f940b62f1951a4052efdeb73fb29151` — `feat(mobile): #235 profile camera only for the owner (R1, R3)`.
   R2 nace verde: la condición anterior ya ocultaba la cámara con el detalle pendiente o en error, incluso con lista del dueño; se conservan las dos filas existentes de `#196 R4` sin edición.
   R4 nace verde: los escenarios existentes `R7: cambiar foto`, `#184 R1`, `#184 R2` y `#196 R4: cámara flotante sobre la foto` ya prueban al dueño y pasan sin edición; no se cambia el flujo de subida.

Detenido tras M7, con su reversión completa. Véase el bloqueo al final del reporte.

### Mutación M1

Plantada temporalmente, sin commit:

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index c4f5405f..6c59ac2a 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -373,7 +373,7 @@ export function ProfileScreen() {
               {addPetCapsule}
             </View>
           </PetHeroHeader>
-          {isOwner ? (
+          {pet ? (
             <BubblePop testID="profile-change-photo-pop" className="absolute bottom-24 right-5">
               <Pressable
                 testID="change-photo"
```

Anclas medidas sobre la mutación (recuento literal equivalente a los grep de la spec y condición en la línea anterior al BubblePop):

```text
{
  "declaración exacta": 1,
  "condición posicional": 0,
  "isOwner": 1,
  "rol de lista .find": 0,
  "primera mascota lista": 0,
  "numstat H0": "1\t0\tmobile-pet-tracker/src/screens/profile/index.tsx"
}
```

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 1. Salida resumida:

```text
FAIL src/screens/profile/index.test.tsx (27.284 s)
Test Suites: 1 failed, 1 total
Tests:       5 failed, 214 passed, 219 total
Snapshots:   0 total
Time:        27.402 s
```

Aserciones rojas (títulos y comienzo de su diagnóstico):

```text
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol walker la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol vet la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 al pasar a una mascota que no es del dueño, la cámara se va y vuelve
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2893 |     await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en owner y el detalle en family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2910 |       expect(await screen.findByTestId('change-photo')).toBeOnTheScreen();
```

Reversión: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`. `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx` vacíos; contenido idéntico al verde.

### Mutación M2

Plantada temporalmente, sin commit:

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index c4f5405f..62734e9b 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -213,7 +213,7 @@ export function ProfileScreen() {
   );
 
   const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
-  const isOwner = pet?.myRole === 'owner';
+  const isOwner = pet?.myRole !== 'family';
   const membersQuery = useQuery({
     queryKey: memberKeys.list(pet?.id ?? ''),
     queryFn: async () => {
```

Anclas medidas sobre la mutación (recuento literal equivalente a los grep de la spec y condición en la línea anterior al BubblePop):

```text
{
  "declaración exacta": 0,
  "condición posicional": 1,
  "isOwner": 2,
  "rol de lista .find": 0,
  "primera mascota lista": 0,
  "numstat H0": "2\t1\tmobile-pet-tracker/src/screens/profile/index.tsx"
}
```

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 1. Salida resumida:

```text
FAIL src/screens/profile/index.test.tsx (31.286 s)
Test Suites: 1 failed, 1 total
Tests:       9 failed, 210 passed, 219 total
Snapshots:   0 total
Time:        31.409 s
```

Aserciones rojas (títulos y comienzo de su diagnóstico):

```text
R7: cambiar foto › does not request a URL when the picker is cancelled (enmendado por #196 R4)
    expect(jest.fn()).toHaveBeenCalledTimes(expected) | Expected number of calls: 1 | Received number of calls: 0
R7: cambiar foto › requests, uploads raw bytes, and refetches the active pet (enmendado por #196 R4)
    expect(jest.fn()).toHaveBeenCalledWith(...expected) | Expected: "http://example.test/v1", "jwt-token", "pet-1", "image/png" | Number of calls: 0
R7: cambiar foto › keeps the old photo and shows an error when upload fails (enmendado por #196 R1, R4)
    Unable to find an element with testID: photo-upload-error | <RNCSafeAreaProvider> | <Text
#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › con la subida fallida deja photo-upload-error inmediatamente tras la entrada del hero (enmendado por #196 R4)
    Unable to find an element with testID: photo-upload-error | <RNCSafeAreaProvider> | <Text
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (detalle pendiente) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (error de detalle) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#196 R4: cámara flotante sobre la foto › #196 R4: con la subida fallida pinta el error justo antes de la info
    Unable to find an element with testID: photo-upload-error | <RNCSafeAreaProvider> | <Text
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol walker la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol vet la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
```

Reversión: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`. `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx` vacíos; contenido idéntico al verde.

### Mutación M3

Plantada temporalmente, sin commit:

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index c4f5405f..d24171fb 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -213,7 +213,7 @@ export function ProfileScreen() {
   );
 
   const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
-  const isOwner = pet?.myRole === 'owner';
+  const isOwner = pet?.myRole === 'owner' || pet?.myRole === 'family';
   const membersQuery = useQuery({
     queryKey: memberKeys.list(pet?.id ?? ''),
     queryFn: async () => {
```

Anclas medidas sobre la mutación (recuento literal equivalente a los grep de la spec y condición en la línea anterior al BubblePop):

```text
{
  "declaración exacta": 0,
  "condición posicional": 1,
  "isOwner": 2,
  "rol de lista .find": 0,
  "primera mascota lista": 0,
  "numstat H0": "2\t1\tmobile-pet-tracker/src/screens/profile/index.tsx"
}
```

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 1. Salida resumida:

```text
FAIL src/screens/profile/index.test.tsx (27.858 s)
Test Suites: 1 failed, 1 total
Tests:       3 failed, 216 passed, 219 total
Snapshots:   0 total
Time:        27.99 s, estimated 32 s
```

Aserciones rojas (títulos y comienzo de su diagnóstico):

```text
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 al pasar a una mascota que no es del dueño, la cámara se va y vuelve
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2893 |     await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en owner y el detalle en family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2910 |       expect(await screen.findByTestId('change-photo')).toBeOnTheScreen();
```

Reversión: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`. `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx` vacíos; contenido idéntico al verde.

### Mutación M4

Plantada temporalmente, sin commit:

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index c4f5405f..1e6dc6a8 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -213,7 +213,7 @@ export function ProfileScreen() {
   );
 
   const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
-  const isOwner = pet?.myRole === 'owner';
+  const isOwner = pet?.myRole !== 'owner';
   const membersQuery = useQuery({
     queryKey: memberKeys.list(pet?.id ?? ''),
     queryFn: async () => {
```

Anclas medidas sobre la mutación (recuento literal equivalente a los grep de la spec y condición en la línea anterior al BubblePop):

```text
{
  "declaración exacta": 0,
  "condición posicional": 1,
  "isOwner": 2,
  "rol de lista .find": 0,
  "primera mascota lista": 0,
  "numstat H0": "2\t1\tmobile-pet-tracker/src/screens/profile/index.tsx"
}
```

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 1. Salida resumida:

```text
FAIL src/screens/profile/index.test.tsx (32.974 s)
Test Suites: 1 failed, 1 total
Tests:       28 failed, 191 passed, 219 total
Snapshots:   0 total
Time:        33.094 s
```

Aserciones rojas (títulos y comienzo de su diagnóstico):

```text
R2: estructura Figma › renders the active pet hero, switcher, pills and information rows (enmendado por #196 R1, R2, R4)
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
R7: cambiar foto › does not request a URL when the picker is cancelled (enmendado por #196 R4)
    expect(jest.fn()).toHaveBeenCalledTimes(expected) | Expected number of calls: 1 | Received number of calls: 0
R7: cambiar foto › requests, uploads raw bytes, and refetches the active pet (enmendado por #196 R4)
    expect(jest.fn()).toHaveBeenCalledWith(...expected) | Expected: "http://example.test/v1", "jwt-token", "pet-1", "image/png" | Number of calls: 0
R7: cambiar foto › keeps the old photo and shows an error when upload fails (enmendado por #196 R1, R4)
    Unable to find an element with testID: photo-upload-error | <RNCSafeAreaProvider> | <Text
#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › superpone la cámara en el anillo con su tamaño, tinta y objetivo táctil (enmendado por #196 R4)
    Unable to find an element with testID: profile-change-photo-pop | <RNCSafeAreaProvider> | <Text
#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › con la subida fallida deja photo-upload-error inmediatamente tras la entrada del hero (enmendado por #196 R4)
    Unable to find an element with testID: photo-upload-error | <RNCSafeAreaProvider> | <Text
#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › expone la cámara habilitada en reposo
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › expone la cámara deshabilitada mientras la subida está en curso
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#184 R1: la cámara no responde mientras sube › #184 R1: no responde a toques durante la subida
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#184 R2: handleChangePhoto ignora toques mientras hay uno en curso › #184 R2: un segundo toque con el picker abierto no lanza otro picker
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#184 R2: handleChangePhoto ignora toques mientras hay uno en curso › #184 R2: libera la guardia tras picker cancelado (enmendado por #196 R1)
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#184 R2: handleChangePhoto ignora toques mientras hay uno en curso › #184 R2: libera la guardia tras formato no soportado (enmendado por #196 R1)
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#184 R2: handleChangePhoto ignora toques mientras hay uno en curso › #184 R2: libera la guardia tras URL denegada (enmendado por #196 R1)
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#184 R2: handleChangePhoto ignora toques mientras hay uno en curso › #184 R2: libera la guardia tras sesión caducada (enmendado por #196 R1)
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#184 R2: handleChangePhoto ignora toques mientras hay uno en curso › #184 R2: libera la guardia tras subida rechazada (enmendado por #196 R1)
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#184 R2: handleChangePhoto ignora toques mientras hay uno en curso › #184 R2: libera la guardia tras excepción al leer el asset (enmendado por #196 R1)
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#184 R2: handleChangePhoto ignora toques mientras hay uno en curso › #184 R2: libera la guardia tras subida correcta (enmendado por #196 R1)
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#196 R4: cámara flotante sobre la foto › #196 R4: con el detalle cargado monta la cámara con labio sobre la foto
    Unable to find an element with testID: profile-change-photo-pop | <RNCSafeAreaProvider> | <Text
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (detalle pendiente) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (error de detalle) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#196 R4: cámara flotante sobre la foto › #196 R4: con la subida fallida pinta el error justo antes de la info
    Unable to find an element with testID: photo-upload-error | <RNCSafeAreaProvider> | <Text
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol owner la cámara se pinta: true
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol walker la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol vet la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 al pasar a una mascota que no es del dueño, la cámara se va y vuelve
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2893 |     await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en owner y el detalle en family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2910 |       expect(await screen.findByTestId('change-photo')).toBeOnTheScreen();
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en family y el detalle en owner la cámara se pinta: true
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
```

Reversión: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`. `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx` vacíos; contenido idéntico al verde.

### Mutación M5

Plantada temporalmente, sin commit:

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index c4f5405f..cf0678c3 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -213,7 +213,7 @@ export function ProfileScreen() {
   );
 
   const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
-  const isOwner = pet?.myRole === 'owner';
+  const isOwner = pets.data?.kind === 'ok' && pets.data.pets.find(({ id }) => id === selectedPetId)?.myRole === 'owner';
   const membersQuery = useQuery({
     queryKey: memberKeys.list(pet?.id ?? ''),
     queryFn: async () => {
```

Anclas medidas sobre la mutación (recuento literal equivalente a los grep de la spec y condición en la línea anterior al BubblePop):

```text
{
  "declaración exacta": 0,
  "condición posicional": 1,
  "isOwner": 2,
  "rol de lista .find": 1,
  "primera mascota lista": 0,
  "numstat H0": "2\t1\tmobile-pet-tracker/src/screens/profile/index.tsx"
}
```

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 1. Salida resumida:

```text
FAIL src/screens/profile/index.test.tsx (30.145 s)
Test Suites: 1 failed, 1 total
Tests:       4 failed, 215 passed, 219 total
Snapshots:   0 total
Time:        30.273 s, estimated 33 s
```

Aserciones rojas (títulos y comienzo de su diagnóstico):

```text
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (detalle pendiente) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (error de detalle) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en owner y el detalle en family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2910 |       expect(await screen.findByTestId('change-photo')).toBeOnTheScreen();
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en family y el detalle en owner la cámara se pinta: true
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
```

Reversión: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`. `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx` vacíos; contenido idéntico al verde.

### Mutación M6

Plantada temporalmente, sin commit:

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index c4f5405f..1378ce63 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -213,7 +213,7 @@ export function ProfileScreen() {
   );
 
   const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
-  const isOwner = pet?.myRole === 'owner';
+  const isOwner = pets.data?.kind === 'ok' && pets.data.pets[0]?.myRole === 'owner';
   const membersQuery = useQuery({
     queryKey: memberKeys.list(pet?.id ?? ''),
     queryFn: async () => {
```

Anclas medidas sobre la mutación (recuento literal equivalente a los grep de la spec y condición en la línea anterior al BubblePop):

```text
{
  "declaración exacta": 0,
  "condición posicional": 1,
  "isOwner": 2,
  "rol de lista .find": 0,
  "primera mascota lista": 1,
  "numstat H0": "2\t1\tmobile-pet-tracker/src/screens/profile/index.tsx"
}
```

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 1. Salida resumida:

```text
FAIL src/screens/profile/index.test.tsx (33.746 s)
Test Suites: 1 failed, 1 total
Tests:       5 failed, 214 passed, 219 total
Snapshots:   0 total
Time:        33.885 s
```

Aserciones rojas (títulos y comienzo de su diagnóstico):

```text
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (detalle pendiente) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (error de detalle) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 al pasar a una mascota que no es del dueño, la cámara se va y vuelve
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2893 |     await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en owner y el detalle en family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2910 |       expect(await screen.findByTestId('change-photo')).toBeOnTheScreen();
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en family y el detalle en owner la cámara se pinta: true
    Unable to find an element with testID: change-photo | <RNCSafeAreaProvider> | <Text
```

Reversión: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`. `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx` vacíos; contenido idéntico al verde.

### Mutación M7

Plantada temporalmente, sin commit:

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index c4f5405f..7a337669 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -214,6 +214,7 @@ export function ProfileScreen() {
 
   const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
   const isOwner = pet?.myRole === 'owner';
+  void isOwner;
   const membersQuery = useQuery({
     queryKey: memberKeys.list(pet?.id ?? ''),
     queryFn: async () => {
@@ -373,7 +374,7 @@ export function ProfileScreen() {
               {addPetCapsule}
             </View>
           </PetHeroHeader>
-          {isOwner ? (
+          {pet ? (
             <BubblePop testID="profile-change-photo-pop" className="absolute bottom-24 right-5">
               <Pressable
                 testID="change-photo"
```

Anclas medidas sobre la mutación (recuento literal equivalente a los grep de la spec y condición en la línea anterior al BubblePop):

```text
{
  "declaración exacta": 1,
  "condición posicional": 0,
  "isOwner": 2,
  "rol de lista .find": 0,
  "primera mascota lista": 0,
  "numstat H0": "2\t0\tmobile-pet-tracker/src/screens/profile/index.tsx"
}
```

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 1. Salida resumida:

```text
FAIL src/screens/profile/index.test.tsx (32.543 s)
Test Suites: 1 failed, 1 total
Tests:       5 failed, 214 passed, 219 total
Snapshots:   0 total
Time:        32.675 s, estimated 34 s
```

Aserciones rojas (títulos y comienzo de su diagnóstico):

```text
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol walker la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol vet la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 al pasar a una mascota que no es del dueño, la cámara se va y vuelve
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2893 |     await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en owner y el detalle en family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2910 |       expect(await screen.findByTestId('change-photo')).toBeOnTheScreen();
```

Reversión: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`. `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx` vacíos; contenido idéntico al verde.

## PARA — contradicción medida en M7

La mutación prescrita en `specs/mobile-profile-photo-owner-only/design.md`, tabla M7, deja la declaración, devuelve la condición a `{pet ? (` y añade `void isOwner;`. Su ancla exigida en esa fila sí se cumple: recuento `isOwner` = 2 y condición posicional = 0. Los cinco casos esperados de R1/R3 fallan por aserción (salida arriba).

Sin embargo, `requirements.md` R3 afirma que M7 da numstat `1<TAB>0`, y la tabla de medidas de `design.md` también pone `1 0` en la columna m7. La mutación literal con `void isOwner;` da **`2<TAB>0`**: añade la declaración y el `void`; la condición vuelve a la de H0 y no aporta diferencias. La medida real y el diff plantado están registrados en §Mutación M7. Omitir el `void` daría `1 0`, pero entonces el recuento `isOwner` sería 1, incumpliendo la propia definición de M7.

Se aplica literalmente el handoff §Spec: «Si encuentras una contradicción, PARA y anótala en el reporte; no adaptes la spec por tu cuenta». No se ha cambiado la spec, ni se ha elegido otra variante de M7. El leader debe conciliar la cifra de numstat de M7 antes de continuar.

Estado al parar:

- Tres commits creados, en orden rojo R1 → rojo R3 → verde común; hashes arriba. No se han reescrito ni rebaseado.
- M1–M7 ejecutadas una por una, detectadas y revertidas con el comando exigido; tras cada reversión, cero diferencias en producción y en el índice.
- Última corrida del código correcto: 219/219 aprobados antes del commit verde. Tras M7, el contenido de producción es idéntico a ese commit.
- `git status --short -- mobile-pet-tracker specs`, `git diff --cached --stat` y `git diff --stat` vacíos. El reporte es el único archivo sin seguimiento antes de crear el marcador solicitado.
- Numstat final contra H0: producción `2 1`; tests `74 0`. No se ha editado ningún test anterior.
- TSC y lint **no ejecutados** por el PARA; no se generaron `progress/tsc_235.log` ni `progress/lint_235.log`. Guardas **no ejecutadas**; inventario leído de las tres carpetas: 78 ficheros de tests.
- M8 y M9 **no ejecutadas**. `traceability.md` conserva sus filas pendientes; no se crea su commit de cierre ni se presenta la batería como completa.
- No se ejecutó `./init.sh`, fetch, merge, rebase, instalación de dependencias, push ni creación/edición de PR. No se tocaron backend, configuración, bookkeeping ni la casilla de smoke humano.
- Próximo paso tras corregir la spec: M8 y M9; verificación final de Perfil y guardas; tsc/lint con los logs indicados; anclas finales; trazabilidad con los tres hashes anteriores; commits de cierre y revisión del leader. Smoke e init siguen a cargo del humano/leader conforme al handoff.

## Reanudación — PARA resuelto por enmienda 30f58feb

Reanudación autorizada por el humano el 2026-11-03T17:17:27.754415+00:00. El commit `30f58feb05298cd02c1690f8307d74d99c518b72` enmienda `design.md` y `requirements.md` R3: **M7 midió `2<TAB>0` (`2 0`), conforme a la spec enmendada**. La cifra anterior era un error de la spec, no de la ejecución. El PARA anterior queda resuelto; se conserva su registro histórico sin reescribirlo. No hace falta repetir M1–M7, ya detectadas y revertidas.

Ruta y branch revalidadas: `/home/claude/sites/Pet-Tracker-wt-235`, `feature/235-mobile-profile-photo-owner-only`. HEAD al retomar: `30f58feb`. Sin cambios en producción ni tests; reporte aún sin seguimiento. `.env` y `node_modules` presentes; `.expo/types/router.d.ts` ausente. Se continúa con M8, M9, Perfil, guardas, tsc, lint, anclas y trazabilidad. No se ejecutan fetch, merge, rebase, bun install ni init.sh.

### Mutación M8

Plantada temporalmente, sin commit:

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index c4f5405f..5a826487 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -213,7 +213,7 @@ export function ProfileScreen() {
   );
 
   const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
-  const isOwner = pet?.myRole === 'owner';
+  const isOwner = pet === null || pet.myRole === 'owner';
   const membersQuery = useQuery({
     queryKey: memberKeys.list(pet?.id ?? ''),
     queryFn: async () => {
```

Anclas medidas sobre la mutación (recuento literal equivalente a los grep de la spec y condición en la línea anterior al BubblePop):

```text
{
  "declaración exacta": 0,
  "condición posicional": 1,
  "isOwner": 2,
  "rol de lista .find": 0,
  "primera mascota lista": 0,
  "numstat H0": "2\t1\tmobile-pet-tracker/src/screens/profile/index.tsx"
}
```

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 1. Salida resumida:

```text
FAIL src/screens/profile/index.test.tsx (32.141 s)
Test Suites: 1 failed, 1 total
Tests:       7 failed, 212 passed, 219 total
Snapshots:   0 total
Time:        32.273 s, estimated 33 s
```

Aserciones rojas (títulos y comienzo de su diagnóstico):

```text
R7: cambiar foto › does not request a URL when the picker is cancelled (enmendado por #196 R4)
    expect(jest.fn()).toHaveBeenCalledTimes(expected) | Expected number of calls: 1 | Received number of calls: 0
R7: cambiar foto › requests, uploads raw bytes, and refetches the active pet (enmendado por #196 R4)
    expect(jest.fn()).toHaveBeenCalledWith(...expected) | Expected: "http://example.test/v1", "jwt-token", "pet-1", "image/png" | Number of calls: 0
R7: cambiar foto › keeps the old photo and shows an error when upload fails (enmendado por #196 R1, R4)
    Unable to find an element with testID: photo-upload-error | <RNCSafeAreaProvider> | <Text
#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › con la subida fallida deja photo-upload-error inmediatamente tras la entrada del hero (enmendado por #196 R4)
    Unable to find an element with testID: photo-upload-error | <RNCSafeAreaProvider> | <Text
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (detalle pendiente) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#196 R4: cámara flotante sobre la foto › #196 R4: sin detalle cargado (error de detalle) no monta la cámara
    expect(received).toBeNull() | Received: <View className="absolute bottom-24 right-5" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"opacity": 1, "transform": [{"scale": 1}] | 2254 |     await renderProfile();
#196 R4: cámara flotante sobre la foto › #196 R4: con la subida fallida pinta el error justo antes de la info
    Unable to find an element with testID: photo-upload-error | <RNCSafeAreaProvider> | <Text
```

Reversión: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`. `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx` vacíos; contenido idéntico al verde.

### Mutación M9

Plantada temporalmente, sin commit:

```diff
diff --git a/mobile-pet-tracker/src/screens/profile/index.tsx b/mobile-pet-tracker/src/screens/profile/index.tsx
index c4f5405f..b4da3fb6 100644
--- a/mobile-pet-tracker/src/screens/profile/index.tsx
+++ b/mobile-pet-tracker/src/screens/profile/index.tsx
@@ -373,8 +373,8 @@ export function ProfileScreen() {
               {addPetCapsule}
             </View>
           </PetHeroHeader>
-          {isOwner ? (
-            <BubblePop testID="profile-change-photo-pop" className="absolute bottom-24 right-5">
+          {pet ? (
+            <BubblePop testID="profile-change-photo-pop" style={isOwner ? undefined : { display: 'none' }} className="absolute bottom-24 right-5">
               <Pressable
                 testID="change-photo"
                 accessibilityRole="button"
```

Anclas medidas sobre la mutación (recuento literal equivalente a los grep de la spec y condición en la línea anterior al BubblePop):

```text
{
  "declaración exacta": 1,
  "condición posicional": 0,
  "isOwner": 2,
  "rol de lista .find": 0,
  "primera mascota lista": 0,
  "numstat H0": "2\t1\tmobile-pet-tracker/src/screens/profile/index.tsx"
}
```

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 1. Salida resumida:

```text
FAIL src/screens/profile/index.test.tsx (30.446 s)
Test Suites: 1 failed, 1 total
Tests:       5 failed, 214 passed, 219 total
Snapshots:   0 total
Time:        30.594 s, estimated 33 s
```

Aserciones rojas (títulos y comienzo de su diagnóstico):

```text
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol walker la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R1: la cámara de Perfil es solo del dueño › #235 R1 con el rol vet la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2865 |       expect(profileChild(hero, 1)).toBe(pop);
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 al pasar a una mascota que no es del dueño, la cámara se va y vuelve
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2893 |     await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
#235 R3: la cámara sigue a la mascota seleccionada › #235 R3 con la lista en owner y el detalle en family la cámara se pinta: false
    expect(received).toBeNull() | Received: <View accessibilityLabel="Cambiar foto" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, | 2910 |       expect(await screen.findByTestId('change-photo')).toBeOnTheScreen();
```

Reversión: `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`. `git diff --cached --stat` y `git diff --stat -- mobile-pet-tracker/src/screens/profile/index.tsx` vacíos; contenido idéntico al verde.

### Verificación final — Perfil

Orden desde `mobile-pet-tracker/`: `bunx jest --runTestsByPath src/screens/profile/index.test.tsx --silent`. Exit 0.

```text
PASS src/screens/profile/index.test.tsx (42.239 s)
Test Suites: 1 passed, 1 total
Tests:       219 passed, 219 total
Snapshots:   0 total
Time:        42.427 s
```

### Verificación final — tipos y lint

Desde `mobile-pet-tracker/`, sin `.expo/types/router.d.ts` (comprobado antes de tsc; no se ha eliminado ningún router generado):

```sh
test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_235.log 2>&1; echo $?
```

Salida: `0`; `tsc_235.log`: **0 bytes**, sin diagnósticos.

```sh
bunx expo lint --no-cache > ../progress/lint_235.log 2>&1 && test ! -s ../progress/lint_235.log && echo LINT_OK
```

Exit 0, salida **`LINT_OK`**; `lint_235.log`: **0 bytes**. Se comprobó el log vacío además del código de salida, conforme al handoff. Los dos logs se borran después de registrar el resultado y no se commitean.

### Verificación final — anclas R1–R4

Medidas por recuento literal (equivalente a `grep -cF`) y por condición inmediatamente anterior al BubblePop:

| Ancla | Final |
|---|---:|
| declaración exacta `const isOwner = pet?.myRole === 'owner';` | 1 |
| declaración justo bajo `const pet = …` | 1 |
| `{isOwner ? (` total / posicional | 1 / 1 |
| `myRole` en producción | 1 |
| `testID="change-photo"` / `testID="profile-change-photo-pop"` | 1 / 1 |
| `.find(({ id }) => id === selectedPetId)?.myRole` | 0 |
| `pets.data.pets[0]` | 0 |
| `onPress={() => void handleChangePhoto()}` | 1 |
| `if (!pet) return;` | 1 |
| `accessibilityState={{ disabled: photoUploading }}` | 1 |
| `absolute bottom-24 right-5` | 1 |
| `size-11 items-center justify-center rounded-full border-3 border-background bg-accent` | 1 |
| `signOut(` | 2 |
| `{pet ? (` (control) | 3 |
| `#235` en producción / citas sin R-id en tests | 0 / 0 |

```sh
git diff --numstat 03701fdb -- mobile-pet-tracker/src/screens/profile/index.tsx mobile-pet-tracker/src/screens/profile/index.test.tsx
```

```text
74	0	mobile-pet-tracker/src/screens/profile/index.test.tsx
2	1	mobile-pet-tracker/src/screens/profile/index.tsx
```

El fichero de tests empieza con todo el contenido de H0, idéntico byte a byte; solo añade 74 líneas al final. Producción y tests sin diferencias respecto a HEAD; índice vacío y `git diff --check` sin salida. No se han añadido estilos, copy ni dependencias.

### Verificación final — Guardas

Orden desde `mobile-pet-tracker/`: `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ --silent`. Exit 0.

```text
PASS src/__tests__/ui-copy-table.ts
PASS src/__tests__/design-drift.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/chunky-cta-canvas-fidelity.test.ts
PASS src/components/__tests__/pet-hero-header.test.tsx (9.527 s)
PASS src/components/__tests__/weight-chart.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/components/__tests__/floating-tab-bar.test.tsx
PASS src/__tests__/map-canvas-fidelity.test.ts
PASS src/components/__tests__/empty-state.test.tsx (6.942 s)
PASS src/components/__tests__/date-field.test.tsx (5.364 s)
PASS src/__tests__/account-flow-canvas-fidelity.test.ts
PASS src/__tests__/canvas-foundations.test.ts
PASS src/components/__tests__/empty-state-hero.test.tsx
PASS src/components/__tests__/pet-switcher.test.tsx
PASS src/__tests__/alerts-canvas-fidelity.test.ts
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/__tests__/alerts-attended-canvas-fidelity.test.ts
PASS src/__tests__/profile-canvas-fidelity.test.ts
PASS src/__tests__/orbit-rename.test.ts
PASS src/__tests__/heroui-text-size-merge.test.ts
PASS src/__tests__/health-weight-canvas-fidelity.test.ts
PASS src/__tests__/home-photo-hero-canvas.test.ts
PASS src/__tests__/zones-canvas-fidelity.test.ts
PASS src/components/__tests__/pet-map.test.tsx
PASS src/__tests__/home-canvas-fidelity.test.ts
PASS src/__tests__/geofences-canvas-fidelity.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/alert-detail-canvas-fidelity.test.ts
PASS src/app/__tests__/alert-detail.navigation.test.tsx (26.269 s)
PASS src/__tests__/tab-bar-canvas-fidelity.test.ts
PASS src/app/__tests__/detail-stack.guard.test.tsx (27.36 s)
PASS src/app/__tests__/reminders-alerts-stack.notification.test.tsx
PASS src/app/__tests__/alert-detail.notification.test.tsx
PASS src/__tests__/tab-headers-canvas.test.ts
PASS src/__tests__/routine-canvas-fidelity.test.ts
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
PASS src/__tests__/profile-photo-hero-canvas.test.ts
PASS src/app/__tests__/detail-stack.navigation.test.tsx
PASS src/__tests__/account-screens-polish.test.ts
PASS src/app/__tests__/detail-stack.test.tsx
PASS src/__tests__/collar-alerts-canvas-fidelity.test.ts
PASS src/components/__tests__/confirm-dialog.test.tsx
PASS src/components/__tests__/pet-avatar.test.tsx
PASS src/components/__tests__/pet-hero-header-motion.test.tsx
PASS src/__tests__/nutrition-canvas-fidelity.test.ts
PASS src/components/__tests__/screen-header.test.tsx
PASS src/components/__tests__/tab-pet-header.test.tsx
PASS src/components/__tests__/field-error-message.test.tsx
PASS src/app/__tests__/theme-scene.test.tsx
PASS src/__tests__/forms-validation-global.test.ts
PASS src/components/__tests__/toggle-switch.test.tsx
PASS src/components/__tests__/card.test.tsx
PASS src/__tests__/hosting-artifacts.test.ts
PASS src/__tests__/pairing-canvas-fidelity.test.ts
PASS src/components/__tests__/back-button.test.tsx
PASS src/components/__tests__/segmented-control.test.tsx
PASS src/__tests__/home-pingo-phrase.test.ts
PASS src/components/__tests__/password-input.test.tsx
PASS src/__tests__/orbit-activity-pose.test.ts
PASS src/__tests__/jest-virtual-mock-lock.test.ts
PASS src/__tests__/orbit-rename-copy.test.ts
PASS src/components/__tests__/rise-in.test.tsx
PASS src/components/__tests__/orbit-float.test.tsx
PASS src/components/__tests__/pop-in.test.tsx
PASS src/components/__tests__/ping-ring.test.tsx
PASS src/__tests__/orbit-charter-voice.test.ts
PASS src/__tests__/no-pets-states.test.ts
PASS src/__tests__/edit-profile.test.ts
PASS src/__tests__/sheet-surface-background.test.ts
PASS src/__tests__/add-pet-two-steps.test.ts
PASS src/components/__tests__/glass-circle.test.tsx
PASS src/components/__tests__/form-error.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/components/__tests__/hero-status-bar.test.tsx
PASS src/app/__tests__/tabs-layout.test.tsx
PASS src/__tests__/heroui-smoke.test.tsx
PASS src/components/__tests__/celebration.test.tsx (66.324 s)
Test Suites: 79 passed, 79 total
Tests:       1642 passed, 1642 total
Snapshots:   1 passed, 1 total
Time:        72.175 s
```

Inventario de guardas conciliado con `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ --listTests --json`: **79 suites esperadas y 79 ejecutadas**, sin omisiones. El recuento inicial de 78 solo contemplaba ficheros con sufijo `.test`/`.spec`; Jest incluye además `src/__tests__/ui-copy-table.ts`, que también pasó. Se compararon los 79 paths descubiertos con los 79 `PASS` de la corrida. Resultado: 1642/1642 tests y 1/1 snapshot verdes. Ningún flake ni reintento en la verificación final.

## Cierre — PARA resuelto, implementación y verificaciones completas

El estado vigente es este cierre; las secciones anteriores conservan el historial del PARA y de su resolución, sin reescritura. La enmienda `30f58feb` valida la medida M7 `2 0`. No quedan bloqueos de implementación.

Batería completa, siempre sobre el fichero entero de Perfil, 219 tests por mutación:

| Mutación | Rojos | Verdes | Tiempo Jest | Resultado |
|---|---:|---:|---|---|
| M1 | 5 | 214 | 27.402 s | detectada y revertida |
| M2 | 9 | 210 | 31.409 s | detectada y revertida |
| M3 | 3 | 216 | 27.99 s | detectada y revertida |
| M4 | 28 | 191 | 33.094 s | detectada y revertida |
| M5 | 4 | 215 | 30.273 s | detectada y revertida |
| M6 | 5 | 214 | 33.885 s | detectada y revertida |
| M7 | 5 | 214 | 32.675 s | detectada y revertida |
| M8 | 7 | 212 | 32.273 s | detectada y revertida |
| M9 | 5 | 214 | 30.594 s | detectada y revertida |

Todas las mutaciones fallan por aserciones y detectan los casos exigidos; ninguna se commiteó. Cada una se revirtió con `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx` y comprobación de cero diferencias en producción e índice. Los rojos adicionales de M2/M4/M8 afectan al flujo de foto porque la mutación monta la cámara antes del detalle o la quita al dueño; no son regresiones del código final. La corrida final sin mutaciones pasa **219/219**.

Verificación final: Perfil **219/219** (42.427 s); guardas **79/79 suites, 1642/1642 tests, 1/1 snapshot** (72.175 s); tsc **0**, log vacío; lint **LINT_OK**, log vacío. Sin flake ni reintento. Los logs temporales se borraron tras medirlos y no se commitean.

Trazabilidad R1–R4 completa, sin filas pendientes, en `5b8a22a7b74e7d042f8432488e46e805824d38ef` — `docs(spec): #235 traceability`; conserva los hashes literales de los dos rojos y del verde común. No se ha rebaseado después. Las tres confirmaciones de TDD y la firma delegada originales siguen intactas. La firma de smoke humano no se ha tocado.

Anclas finales correctas. Producción contra H0: **2 líneas añadidas y 1 quitada**. Tests: **74 añadidas, 0 quitadas**, con el contenido anterior idéntico. `git status --short -- mobile-pet-tracker specs`, índice y diff de trabajo vacíos tras el commit de trazabilidad. El único archivo sin seguimiento antes de este cierre es el reporte.

Se cierra el reporte en un commit separado `docs(progress): #235 implementation report`, después del commit de trazabilidad, sin tocar producción, tests ni otros ficheros. Tras ese commit se verifica el árbol limpio y se crea como última acción el marcador `.done`, no versionado, con la ruta absoluta de este reporte.

Pendiente del leader/humano según el handoff: ejecutar `./init.sh`, revisar, abrir PR a `dev` y realizar/firmar el smoke de dueño/family antes de declarar la feature `done`. No se ejecutaron fetch, merge, rebase, bun install ni init.sh; no se abrió ni editó PR; no se hizo push. No se tocaron backend, dependencias, configuración, `feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/history.md`, `docs/` ni el handoff. La única enmienda a requirements/design es la del leader en `30f58feb`.
