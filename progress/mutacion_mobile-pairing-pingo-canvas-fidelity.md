# Prueba de mutación — mobile-pairing-pingo-canvas-fidelity (#188)

## Identidad comprobada antes de modificar archivos

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-188-probe` (exit=0).
- `git rev-parse --short HEAD`: `ec882bae` (exit=0). HEAD probado para B1–B4 y M1–M5.
- `git cat-file -e HEAD:progress/handoff_mutacion_mobile-pairing-pingo-canvas-fidelity.md`: exit=0; el handoff existe en ese HEAD.
- `git status --short` inicial: salida vacía (exit=0).
- Skills cargadas: ninguna.

## Resultado

Las cuatro líneas base están verdes y las cinco mutaciones son **ROJO POR ASERCIÓN**, cada una en la aserción exigida. Todas las mutaciones están revertidas y el worktree probe está limpio.

Todos los comandos de test se ejecutaron desde `/home/claude/sites/Pet-Tracker-wt-188-probe/mobile-pet-tracker`. Cada corrida se ejecutó una sola vez. Se capturó el código real del test con `echo exit=$?`, sin pipes.

| Corrida | Código de salida | Línea Tests: | Resultado |
| --- | --- | --- | --- |
| B1 | 0 | `Tests:       78 skipped, 10 passed, 88 total` | VERDE |
| B2 | 0 | `Tests:       2 skipped, 1 passed, 3 total` | VERDE |
| B3 | 0 | `Tests:       1 skipped, 2 passed, 3 total` | VERDE |
| B4 | 0 | `Tests:       83 skipped, 5 passed, 88 total` | VERDE |
| M1 | 1 | `Tests:       10 failed, 78 skipped, 88 total` | ROJO POR ASERCIÓN |
| M2 | 1 | `Tests:       1 failed, 2 skipped, 3 total` | ROJO POR ASERCIÓN |
| M3 | 1 | `Tests:       1 failed, 1 skipped, 1 passed, 3 total` | ROJO POR ASERCIÓN |
| M4 | 1 | `Tests:       1 failed, 1 skipped, 1 passed, 3 total` | ROJO POR ASERCIÓN |
| M5 | 1 | `Tests:       4 failed, 83 skipped, 1 passed, 88 total` | ROJO POR ASERCIÓN |

## Líneas base B1–B4

### B1 — #188 R9

```bash
FORCE_COLOR=0 bun run test --runInBand --runTestsByPath src/screens/pairing/index.test.tsx -t "#188 R9" > /home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_B1.log 2>&1; echo exit=$?
```

- Código de salida capturado con `echo`: `exit=0`.
- `Tests:       78 skipped, 10 passed, 88 total`
- Resultado: VERDE; selecciona tests y ninguno falla.
- HEAD: `ec882bae`, sin mutar.
- Log completo: `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_B1.log`.

### B2 — #188 R11

```bash
FORCE_COLOR=0 bun run test --runInBand --runTestsByPath src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R11" > /home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_B2.log 2>&1; echo exit=$?
```

- Código de salida capturado con `echo`: `exit=0`.
- `Tests:       2 skipped, 1 passed, 3 total`
- Resultado: VERDE; selecciona tests y ninguno falla.
- HEAD: `ec882bae`, sin mutar.
- Log completo: `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_B2.log`.

### B3 — #188 R12

```bash
FORCE_COLOR=0 bun run test --runInBand --runTestsByPath src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R12" > /home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_B3.log 2>&1; echo exit=$?
```

- Código de salida capturado con `echo`: `exit=0`.
- `Tests:       1 skipped, 2 passed, 3 total`
- Resultado: VERDE; selecciona tests y ninguno falla.
- HEAD: `ec882bae`, sin mutar.
- Log completo: `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_B3.log`.

### B4 — #188 R14

```bash
FORCE_COLOR=0 bun run test --runInBand --runTestsByPath src/screens/pairing/index.test.tsx -t "#188 R14" > /home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_B4.log 2>&1; echo exit=$?
```

- Código de salida capturado con `echo`: `exit=0`.
- `Tests:       83 skipped, 5 passed, 88 total`
- Resultado: VERDE; selecciona tests y ninguno falla.
- HEAD: `ec882bae`, sin mutar.
- Log completo: `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_B4.log`.

## Mutaciones M1–M5

### M1 — #188 R9

- HEAD probado: `ec882bae`.
- Antes de aplicar: `git status --short` devolvió salida vacía (exit=0).
- Mutación aplicada: Inserción tras la línea original 283 de `mobile-pet-tracker/src/screens/pairing/index.tsx`; línea nueva 284.

Diff capturado con `git diff -- mobile-pet-tracker/src/screens/pairing/index.tsx` antes del test:

```diff
diff --git a/mobile-pet-tracker/src/screens/pairing/index.tsx b/mobile-pet-tracker/src/screens/pairing/index.tsx
index 9f9418c7..55908276 100644
--- a/mobile-pet-tracker/src/screens/pairing/index.tsx
+++ b/mobile-pet-tracker/src/screens/pairing/index.tsx
@@ -281,6 +281,7 @@ export function PairingScreen() {
             {t('pairing.pairCollar')}
           </Text>
         ) : null}
+        <Text testID="pairing-subtitle">mutacion R9</Text>
 
         {pets.data === undefined ? (
           <View testID="pairing-skeleton" className="gap-3">
```

Comando exacto:

```bash
FORCE_COLOR=0 bun run test --runInBand --runTestsByPath src/screens/pairing/index.test.tsx -t "#188 R9" > /home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M1.log 2>&1; echo exit=$?
```

- Código de salida capturado con `echo`: `exit=1`.
- `Tests:       10 failed, 78 skipped, 88 total`
- Veredicto: **ROJO POR ASERCIÓN**.
- Línea de fallo, común a todas las filas rojas: `src/screens/pairing/index.test.tsx:1249`.
- Valor/diff observado: Se recibió `<Text testID="pairing-subtitle">mutacion R9</Text>` en las diez filas, todas en la misma aserción `toBeNull()`.

Filas rojas (nombres del it):

- `#188 R9: omits the unapproved subtitle in loading`
- `#188 R9: omits the unapproved subtitle in pets-error`
- `#188 R9: omits the unapproved subtitle in no-pets`
- `#188 R9: omits the unapproved subtitle in linking`
- `#188 R9: omits the unapproved subtitle in paired-loading`
- `#188 R9: omits the unapproved subtitle in paired-tracked`
- `#188 R9: omits the unapproved subtitle in paired-free`
- `#188 R9: omits the unapproved subtitle in paired-unknown`
- `#188 R9: omits the unapproved subtitle in claim-error`
- `#188 R9: omits the unapproved subtitle in ready`

Extracto literal del bloque de la aserción (máximo 10 líneas; representativo de las filas indicadas):

```text
    expect(received).toBeNull()

    Received: <Text testID="pairing-subtitle">mutacion R9</Text>

      1247 |     }
      1248 |     await screen.findByTestId(anchor);
    > 1249 |     expect(screen.queryByTestId('pairing-subtitle', { includeHiddenElements: true })).toBeNull();
           |                                                                                       ^
```

- Reversión ejecutada al terminar la corrida: `git checkout -- mobile-pet-tracker/src/screens/pairing/index.tsx` (exit=0).
- Comprobación tras revertir: `git status --short` devolvió salida vacía (exit=0).
- Log completo: `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M1.log`.

### M2 — #188 R11

- HEAD probado: `ec882bae`.
- Antes de aplicar: `git status --short` devolvió salida vacía (exit=0).
- Mutación aplicada: Sustitución exclusiva de la expresión de la línea 388 de `mobile-pet-tracker/src/screens/pairing/index.tsx` por el literal `Vincular collar`. La línea 281 permaneció intacta.

Diff capturado con `git diff -- mobile-pet-tracker/src/screens/pairing/index.tsx` antes del test:

```diff
diff --git a/mobile-pet-tracker/src/screens/pairing/index.tsx b/mobile-pet-tracker/src/screens/pairing/index.tsx
index 9f9418c7..874053d1 100644
--- a/mobile-pet-tracker/src/screens/pairing/index.tsx
+++ b/mobile-pet-tracker/src/screens/pairing/index.tsx
@@ -385,7 +385,7 @@ export function PairingScreen() {
               onPress={() => void handleClaim()}
             >
               <Text className="text-17 font-extrabold text-accent-foreground">
-                {t('pairing.pairCollar')}
+                Vincular collar
               </Text>
             </Button>
           </View>
```

Comando exacto:

```bash
FORCE_COLOR=0 bun run test --runInBand --runTestsByPath src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R11" > /home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M2.log 2>&1; echo exit=$?
```

- Código de salida capturado con `echo`: `exit=1`.
- `Tests:       1 failed, 2 skipped, 3 total`
- Veredicto: **ROJO POR ASERCIÓN**.
- Línea de fallo, común a todas las filas rojas: `src/__tests__/pairing-canvas-fidelity.test.ts:53`.
- Valor/diff observado: `looseCopy` recibió `["Vincular collar"]` en lugar de `[]`; el diff muestra el literal.

Filas rojas (nombres del it):

- `#188 R11: resolves visible copy through bilingual catalog keys registered for pairing`

Extracto literal del bloque de la aserción (máximo 10 líneas; representativo de las filas indicadas):

```text
    - Array []
    + Array [
    +   "Vincular collar",
    + ]

      51 |   visit(tree);
      52 |
    > 53 |   expect(looseCopy).toEqual([]);
         |                     ^
```

- Reversión ejecutada al terminar la corrida: `git checkout -- mobile-pet-tracker/src/screens/pairing/index.tsx` (exit=0).
- Comprobación tras revertir: `git status --short` devolvió salida vacía (exit=0).
- Log completo: `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M2.log`.

### M3 — #188 R12

- HEAD probado: `ec882bae`.
- Antes de aplicar: `git status --short` devolvió salida vacía (exit=0).
- Mutación aplicada: Cambio exclusivo del `className` de la línea 270 de `mobile-pet-tracker/src/screens/pairing/index.tsx`, añadiendo `w-[3px]`.

Diff capturado con `git diff -- mobile-pet-tracker/src/screens/pairing/index.tsx` antes del test:

```diff
diff --git a/mobile-pet-tracker/src/screens/pairing/index.tsx b/mobile-pet-tracker/src/screens/pairing/index.tsx
index 9f9418c7..c88c4a0a 100644
--- a/mobile-pet-tracker/src/screens/pairing/index.tsx
+++ b/mobile-pet-tracker/src/screens/pairing/index.tsx
@@ -267,7 +267,7 @@ export function PairingScreen() {
         }}
       >
         {phase === 'idle' && selectedPet?.device === null ? (
-          <View className="items-center justify-center" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
+          <View className="items-center justify-center w-[3px]" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
             <PingRing testID="pairing-ring-0" delay={0} className={PAIRING_RING_CLASS_NAME} />
             <PingRing testID="pairing-ring-1" delay={PAIRING_ARTBOARD_RING_DELAY_MS} className={PAIRING_RING_CLASS_NAME} />
             <PingoFloat testID="pairing-pingo-float">
```

Comando exacto:

```bash
FORCE_COLOR=0 bun run test --runInBand --runTestsByPath src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R12" > /home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M3.log 2>&1; echo exit=$?
```

- Código de salida capturado con `echo`: `exit=1`.
- `Tests:       1 failed, 1 skipped, 1 passed, 3 total`
- Veredicto: **ROJO POR ASERCIÓN**.
- Línea de fallo, común a todas las filas rojas: `src/__tests__/pairing-canvas-fidelity.test.ts:73`.
- Valor/diff observado: El source recibido contiene `className="items-center justify-center w-[3px]"`, detectado por `/className="[^"]*\[/`. La fila de `src/components/ping-ring.tsx` pasó.

Filas rojas (nombres del it):

- `#188 R12: keeps hex colors and bracket classes out of src/screens/pairing/index.tsx`

Extracto literal del bloque de la aserción (máximo 10 líneas; representativo de las filas indicadas):

```text
      71 |   const hexLiteral = /#(?!\d{2,3} R\d)[\da-f]{3,8}\b/i;
      72 |   expect(source).not.toMatch(hexLiteral);
    > 73 |   expect(source).not.toMatch(/className="[^"]*\[/);
         |                      ^
      74 | });
      75 |

      at toMatch (src/__tests__/pairing-canvas-fidelity.test.ts:73:22)
```

- Reversión ejecutada al terminar la corrida: `git checkout -- mobile-pet-tracker/src/screens/pairing/index.tsx` (exit=0).
- Comprobación tras revertir: `git status --short` devolvió salida vacía (exit=0).
- Log completo: `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M3.log`.

### M4 — #188 R12

- HEAD probado: `ec882bae`.
- Antes de aplicar: `git status --short` devolvió salida vacía (exit=0).
- Mutación aplicada: Inserción como nueva línea 15 de `mobile-pet-tracker/src/components/ping-ring.tsx`, inmediatamente dentro del cuerpo de la función exportada `PingRing`, con dos espacios de indentación.

Diff capturado con `git diff -- mobile-pet-tracker/src/components/ping-ring.tsx` antes del test:

```diff
diff --git a/mobile-pet-tracker/src/components/ping-ring.tsx b/mobile-pet-tracker/src/components/ping-ring.tsx
index e207a8e0..75a8588e 100644
--- a/mobile-pet-tracker/src/components/ping-ring.tsx
+++ b/mobile-pet-tracker/src/components/ping-ring.tsx
@@ -12,6 +12,7 @@ import Animated, {
 import { MOTION_PING_FROM, MOTION_PING_TO_SCALE, MOTION_PING_TIMING } from '@/theme/motion';
 
 export function PingRing({ testID, delay, className }: { testID: string; delay: number; className: string }) {
+  const probeColor = '#ff0000';
   const reduceMotion = useReducedMotion();
   const scale = useSharedValue(reduceMotion ? 1 : MOTION_PING_FROM);
   const opacity = useSharedValue(reduceMotion ? 0.3 : MOTION_PING_FROM);
```

Comando exacto:

```bash
FORCE_COLOR=0 bun run test --runInBand --runTestsByPath src/__tests__/pairing-canvas-fidelity.test.ts -t "#188 R12" > /home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M4.log 2>&1; echo exit=$?
```

- Código de salida capturado con `echo`: `exit=1`.
- `Tests:       1 failed, 1 skipped, 1 passed, 3 total`
- Veredicto: **ROJO POR ASERCIÓN**.
- Línea de fallo, común a todas las filas rojas: `src/__tests__/pairing-canvas-fidelity.test.ts:72`.
- Valor/diff observado: El source recibido contiene código ejecutable `const probeColor = '#ff0000';` dentro de `PingRing`; `hexLiteral` detecta el hexadecimal. La fila de `src/screens/pairing/index.tsx` pasó.

Filas rojas (nombres del it):

- `#188 R12: keeps hex colors and bracket classes out of src/components/ping-ring.tsx`

Extracto literal del bloque de la aserción (máximo 10 líneas; representativo de las filas indicadas):

```text
      70 |   const source = readSource(file);
      71 |   const hexLiteral = /#(?!\d{2,3} R\d)[\da-f]{3,8}\b/i;
    > 72 |   expect(source).not.toMatch(hexLiteral);
         |                      ^
      73 |   expect(source).not.toMatch(/className="[^"]*\[/);
      74 | });
      75 |
```

- Reversión ejecutada al terminar la corrida: `git checkout -- mobile-pet-tracker/src/components/ping-ring.tsx` (exit=0).
- Comprobación tras revertir: `git status --short` devolvió salida vacía (exit=0).
- Log completo: `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M4.log`.

### M5 — #188 R14

- HEAD probado: `ec882bae`.
- Antes de aplicar: `git status --short` devolvió salida vacía (exit=0).
- Mutación aplicada: Cambio exclusivo de la condición de la línea 269 de `mobile-pet-tracker/src/screens/pairing/index.tsx`. Las líneas 279 y 350 permanecieron intactas.

Diff capturado con `git diff -- mobile-pet-tracker/src/screens/pairing/index.tsx` antes del test:

```diff
diff --git a/mobile-pet-tracker/src/screens/pairing/index.tsx b/mobile-pet-tracker/src/screens/pairing/index.tsx
index 9f9418c7..b2e00484 100644
--- a/mobile-pet-tracker/src/screens/pairing/index.tsx
+++ b/mobile-pet-tracker/src/screens/pairing/index.tsx
@@ -266,7 +266,7 @@ export function PairingScreen() {
           paddingBottom: insets.bottom + 24,
         }}
       >
-        {phase === 'idle' && selectedPet?.device === null ? (
+        {phase === 'idle' ? (
           <View className="items-center justify-center" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
             <PingRing testID="pairing-ring-0" delay={0} className={PAIRING_RING_CLASS_NAME} />
             <PingRing testID="pairing-ring-1" delay={PAIRING_ARTBOARD_RING_DELAY_MS} className={PAIRING_RING_CLASS_NAME} />
```

Comando exacto:

```bash
FORCE_COLOR=0 bun run test --runInBand --runTestsByPath src/screens/pairing/index.test.tsx -t "#188 R14" > /home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M5.log 2>&1; echo exit=$?
```

- Código de salida capturado con `echo`: `exit=1`.
- `Tests:       4 failed, 83 skipped, 1 passed, 88 total`
- Veredicto: **ROJO POR ASERCIÓN**.
- Línea de fallo, común a todas las filas rojas: `src/screens/pairing/index.test.tsx:1292`.
- Valor/diff observado: Las cuatro filas fallidas recibieron el componente de imagen con `testID="pairing-pingo"` en el primer paso del bucle de `toBeNull()`. `#188 R14: preserves ready without the linking hero` pasó.

Filas rojas (nombres del it):

- `#188 R14: preserves tracked without the linking hero`
- `#188 R14: preserves free without the linking hero`
- `#188 R14: preserves unknown without the linking hero`
- `#188 R14: preserves no-pets without the linking hero`

Extracto literal del bloque de la aserción (máximo 10 líneas; representativo de las filas indicadas):

```text
    expect(received).toBeNull()

    Received: <ViewManagerAdapter_ExpoImage containerViewRef={"[React.ref]"} contentFit="contain" contentPosition={{"left": "50%", "top": "50%"}} height={150} nativeViewRef={"[React.ref]"} onError={[Function anonymous]} onLoad={[Function anonymous]} onLoadStart={[Function anonymous]} onProgress={[Function anonymous]} placeholder={[]} sfEffect={null} source={[{"testUri": "../../../assets/images/pingo-collar.webp"}]} style={{"height": 150, "width": 150}} symbolSize={null} symbolWeight={null} testID="pairing-pingo" transition={null} width={150} />

      1290 |     }
      1291 |     for (const testID of ['pairing-pingo', 'pairing-ring-0', 'pairing-ring-1', 'pairing-pingo-float']) {
    > 1292 |       expect(screen.queryByTestId(testID, { includeHiddenElements: true })).toBeNull();
           |                                                                             ^
```

- Reversión ejecutada al terminar la corrida: `git checkout -- mobile-pet-tracker/src/screens/pairing/index.tsx` (exit=0).
- Comprobación tras revertir: `git status --short` devolvió salida vacía (exit=0).
- Log completo: `/home/claude/sites/Pet-Tracker-wt-188/progress/mutacion_188_M5.log`.

## Estado final

- `git rev-parse --short HEAD`: `ec882bae` (exit=0), igual que al inicio.
- `git status --short` del worktree probe: salida vacía (exit=0) después de todas las reversiones.
- Skills cargadas: ninguna.
- Entregables: este reporte y los nueve logs completos en las rutas autorizadas del worktree principal.
- No se ejecutó `./init.sh`, no se instalaron dependencias y no se ejecutaron `git add`, `git commit`, `git push` ni `git stash`.
- No se crearon marcadores `.done` ni se modificaron `progress/current.md`, handoffs, `feature_list.json`, `specs/` o `docs/`.
