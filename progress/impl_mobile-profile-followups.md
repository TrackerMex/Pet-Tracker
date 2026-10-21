```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-184
```

```text
$ git branch --show-current
feature/184-mobile-profile-followups
```

```text
$ git rev-parse --short HEAD
6a581de8
```

```text
$ git status --short
(sin salida)
```

# Implementación — mobile-profile-followups (#184)

H0: `6a581de8`. Inicio: 2026-10-20. Orden: R5, R1, R3, R4, R2-test, R2-fix, docs.

## Anclas H0

- A1: `grep -c '^status: approved' specs/mobile-profile-followups/requirements.md` → `1` (esperado `1`).
- A2: `grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-20)' specs/mobile-profile-followups/requirements.md` → `1` (esperado `1`).
- A3: `grep -cF 'disabled={photoUploading}' mobile-pet-tracker/src/screens/profile/index.tsx` → `1` (esperado `1`).
- A4: `grep -cF photoBusyRef mobile-pet-tracker/src/screens/profile/index.tsx` → `0` (esperado `0`).
- A5: `grep -cF ImagePicker.launchImageLibraryAsync mobile-pet-tracker/src/screens/profile/index.tsx` → `1` (esperado `1`).
- A6: `grep -cF 'className="rounded-xl bg-danger-soft"' mobile-pet-tracker/src/screens/profile/index.tsx` → `1` (esperado `1`).
- A7: `grep -cF 'size={40} cacheKey={pet.id}' mobile-pet-tracker/src/components/pet-switcher.tsx` → `1` (esperado `1`).
- A8: `grep -cF onStartShouldSetResponder mobile-pet-tracker/src/screens/profile/index.test.tsx` → `0` (esperado `0`).
- A9: `grep -cF danger-soft mobile-pet-tracker/src/screens/profile/index.test.tsx` → `0` (esperado `0`).
- A10: `grep -cF "findByText('Ada Lovelace')" mobile-pet-tracker/src/screens/profile/index.test.tsx` → `0` (esperado `0`).
- A11: `grep -cF "getByText('Ada Lovelace')" mobile-pet-tracker/src/screens/profile/index.test.tsx` → `1` (esperado `1`).
- A12: `grep -cF cacheKey mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx` → `0` (esperado `0`).
- A13: `grep -cF useFakeTimers mobile-pet-tracker/src/screens/profile/index.test.tsx` → `0` (esperado `0`).
- A14: `grep -cF "describe('#173 R4:" mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx` → `1` (esperado `1`).
- A15: `grep -cF "describe('R1: me card'" mobile-pet-tracker/src/screens/profile/index.test.tsx` → `1` (esperado `1`).
- A16: `bash -c 'test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok'` → `ok` (esperado `ok`).

## Entorno y desvíos iniciales

- Logs fuera del árbol: `/tmp/pet-tracker-184.kyzq_jcv`. Mediciones Jest con `FORCE_COLOR=0`, redirección sin pipe.
- Se inició `./init.sh` por la instrucción general antes de leer la excepción del handoff. Se detuvo con SIGTERM (exit 143) durante el build; no llegó a tests ni modificó ficheros versionados. No se volverá a ejecutar: suite completa y PR a cargo del leader.
- Skill cargada: `ponytail` (obligatoria por las instrucciones del entorno para tareas de código). Skills Expo: ninguna; solo useRef y tests RN, sin diseño, animación ni UI nueva. Se leyó la referencia SDK 57 por `mobile-pet-tracker/AGENTS.md`.
- No se modifican progress/current.md, progress/history.md, STATUS.md ni feature_list.json; prevalece el alcance específico del handoff.

## Mediciones

Evidencia por requisito, en orden de ejecución.

### Base propia (sin mutaciones)

- `FORCE_COLOR=0 bunx jest src/screens/profile/index.test.tsx > /tmp/pet-tracker-184.kyzq_jcv/base-profile.log 2>&1`: exit 0, 142 passed.
- `FORCE_COLOR=0 bunx jest src/components/__tests__/pet-switcher.test.tsx > /tmp/pet-tracker-184.kyzq_jcv/base-switcher.log 2>&1`: exit 0, 7 passed.
- `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit`: exit 0, log `base-tsc.log` vacío.
- `pgrep -af '[i]nit\.sh'`: sin salida, exit 1 antes de Jest. `node_modules`: presente.

### R5 / X15

- Spike real de 50 ms en `mockGetMe`, sin timers falsos: cuerpo antiguo exit 1, `Unable to find an element with text: Ada Lovelace` (X15-old.log); cuerpo nuevo exit 0, 1 passed (X15-new.log).
- Revertido todo el spike con `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.test.tsx`; `git diff --stat` vacío. Reaplicada solamente la espera `findByText`; correo y llamada a getMe conservados.
- R5 nace verde sin producción nueva; el rojo es el spike retirado.

### R1 / X1

- R1 completo nace verde sin cambios de producción (R1-green.log: exit 0, 1 passed). Sonda existente: true en reposo, false en subida, true tras error.
- X1, quitar `disabled={photoUploading}`: exit 1; sonda `Expected: false / Received: true` (X1-sonda.log). La aserción corta el test antes de los contadores: una segunda medición diagnóstica movió temporalmente esa aserción después de los contadores y vio `Expected number of calls: 1 / Received number of calls: 2` en el picker (X1-counter.log). No se commiteó esa reordenación.
- Producción revertida con `git checkout HEAD -- .../index.tsx`; diagnóstico revertido desde el índice (que guardaba el test nuevo) con `git checkout -- .../index.test.tsx`. `git diff --stat` vacío (test en el índice, informe sin seguimiento); disabled vuelve a 1. Esta es la misma estrategia de staging para los candados siguientes: solo la mutación de producción entra en el diff sin stage.

### R3 / X7–X10

- R3 nace verde (R3-green.log: 1 passed). El host expone source como arreglo y style como objeto, como prescribe la spec; sin desvío de sonda.
- X7 (`size={44}`): exit 1, R3 rojo en style: esperado width/height 40 y borderRadius 20; recibido 44/44/22.
- X8 (sin cacheKey): exit 1, R3 rojo en source del primer avatar: falta `cacheKey: pet-1`.
- X9 (cacheKey por nombre): exit 1, R3 rojo en source del primer avatar: esperado pet-1, recibido Luna; la primera aserción detiene el test antes del segundo avatar.
- X10 (cacheKey de pets[0]): exit 1, R3 rojo en source del segundo avatar: esperado pet-2, recibido pet-1.
- Cada mutación se plantó por separado y se revirtió con `git checkout HEAD -- mobile-pet-tracker/src/components/pet-switcher.tsx`; `git diff --stat` vacío entre corridas (test en stage). Ancla final size/cacheKey: 1. Logs X7.log a X10.log; en cada selección: 1 failed, 7 skipped.

### R4 / X11–X14

- Primera corrida de R4: exit 0, 1 passed; cadena real idéntica a la aprobada: `pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md rounded-xl bg-danger-soft`. R4 nace verde, sin cambios visuales.
- X11: exit 1, recibido `rounded-2xl` en lugar de `rounded-xl`.
- X12: exit 1, falta `bg-danger-soft` al final de la cadena.
- X13: exit 1, falta `rounded-xl` al final de la cadena.
- X14: exit 1, recibido `button__root--variant-danger` en lugar de `button__root--variant-danger-soft`.
- En las cuatro selecciones solo R4 rojo, 143 omitidos. Logs X11.log a X14.log. Cada mutación revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`; `git diff --stat` vacío entre corridas; ancla className final 1. Ningún ajuste de cadena ni de producción.

### R2 — rojo antes de producción

- `R2-red-target.log`: exit 1, solo el doble toque rojo: `Expected number of calls: 1 / Received number of calls: 2`; las siete filas de liberación verdes (7 passed, 144 skipped).
- Filas nacidas verdes: picker cancelado, formato no soportado, URL denegada, sesión caducada, subida rechazada, excepción al leer el asset, subida correcta.
- Esperas: error visible y cámara habilitada; en éxito se espera la nueva URL en el avatar antes de aseverar la segunda llamada de getPet. En unauthorized se espera la cámara habilitada y después se asevera signOut. Se prioriza la regla explícita «esperar al árbol, nunca a contador de mock» sobre los ejemplos contradictorios de tasks.md para éxito/unauthorized. Picker cancelado: solo await press, sin espera artificial. Fetch original restaurado en afterEach.

### R2 — verde

- Commit rojo completo medido: R2-red-file.log, exit 1, solo doble toque rojo y 151 passed. TSC rojo: exit 0. Guardia escrita únicamente después del commit `5221b327`.
- Guardia síncrona junto a selectedPetIdRef, adquirida tras pet existente, finally externo cubriendo picker y upload; try/catch/finally interno conservado. Sin cambios de JSX.
- R2-green-target.log: exit 0, 8 passed. `grep -cF photoBusyRef .../index.tsx`: 4 (sin desvío).

### R2 / X4–X6 tras el commit verde

- X4, quitar la lectura de la guardia: exit 1, doble toque rojo (esperado 1 picker, recibido 2), siete filas de liberación verdes. Total seleccionado 1 rojo / 7 verdes.
- X5, no liberar nunca: exit 1, doble toque verde y las siete filas de liberación rojas (cada una esperaba 2 llamadas al picker y recibió 1). Total 7 rojos / 1 verde.
- X6, liberar solo en el finally interno: exit 1, picker cancelado y formato no soportado rojos (esperado 2, recibido 1); doble toque y las cinco demás filas verdes. Total 2 rojos / 6 verdes.
- Reparto idéntico al diseño. 144 omitidos por corrida. X4.log, X5.log y X6.log. Tras cada una `git checkout HEAD -- .../index.tsx` y `git diff --stat` vacío; cero mutaciones commiteadas.

### R1 tras R2 / X2–X3

- X2, quitar disabled tras la guardia: exit 1 en la sonda (`Expected: false / Received: true`). Diagnóstico temporal reordenando la sonda tras ambos contadores: los dos contadores pasan con 1 y solo la sonda falla (X2-counter.log). Reordenación retirada, producción restaurada con checkout HEAD; diff --stat vacío.
- **Desvío medido en X3** (`disabled={false}`): exit 1 antes de llegar a la sonda, en la espera de accessibilityState. Esperado `{ disabled: true }`; recibido `{ busy: undefined, checked: undefined, disabled: false, expanded: undefined, selected: undefined }`. RN impone disabled=false en ese caso. Sonda y contadores no se alcanzan en esta corrida. Esto difiere de la tabla de diseño, que esperaba accessibilityState true y rojo solo en la sonda; no se cambió ni el requisito ni la tabla, como ordena la nota de X3.
- X2 y X3: solo el it de R1 seleccionado rojo, 151 omitidos; los demás no se ejecutan en estas selecciones. Logs X2.log, X2-counter.log, X3.log. Mutaciones y diagnóstico revertidos; `git diff --stat` vacío.

### R6 — grep-clean y alcance

Extracción: `git diff --unified=0 6a581de8 -- <los tres ficheros de código>`; solo líneas añadidas (excluyendo cabeceras +++), guardadas en `/tmp/pet-tracker-184.kyzq_jcv/R6-added.txt`.

- hex: `grep -cP '#(?!\d{2,3} R\d)[0-9a-fA-F]{3,8}\b' /tmp/pet-tracker-184.kyzq_jcv/R6-added.txt` → **0** (exit 1 = sin coincidencias).
- clases arbitrarias: `grep -cP '[A-Za-z0-9_-]+-\[[^\]]+\]' /tmp/pet-tracker-184.kyzq_jcv/R6-added.txt` → **0** (exit 1 = sin coincidencias).
- StyleSheet.create: `grep -cP 'StyleSheet\.create' /tmp/pet-tracker-184.kyzq_jcv/R6-added.txt` → **0** (exit 1 = sin coincidencias).
- sombras legacy: `grep -cP 'shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' /tmp/pet-tracker-184.kyzq_jcv/R6-added.txt` → **0** (exit 1 = sin coincidencias).
- emoji: `grep -cP '[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}\x{20E3}\x{200D}]' /tmp/pet-tracker-184.kyzq_jcv/R6-added.txt` → **0** (exit 1 = sin coincidencias).

- Comprobación de alcance de producción: prefijo del handler idéntico a H0 al quitar la declaración de photoBusyRef; todo desde `const remindersLink` al final idéntico byte a byte. Cuatro referencias a photoBusyRef. `git diff -w 6a581de8 -- mobile-pet-tracker/src/screens/profile/index.tsx` confirma solo guardia y finally externo; cero JSX cambiado.
- Nombres nuevos de describe/it y título it.each: todos citan `#184 R<n>`; R5 conserva el it existente. Sin comentarios nuevos en código, dependencias ni cambios de i18n.

### Comandos de mutación y selecciones

Todos desde `mobile-pet-tracker/`, con salida directa a `<log>` fuera del árbol, sin pipe:

- X15: `FORCE_COLOR=0 bunx jest src/screens/profile/index.test.tsx -t 'shows the real account name and email' > <log> 2>&1`.
- X1, X2, X3: `FORCE_COLOR=0 bunx jest src/screens/profile/index.test.tsx -t '#184 R1:' > <log> 2>&1`.
- X4, X5, X6: `FORCE_COLOR=0 bunx jest src/screens/profile/index.test.tsx -t '#184 R2:' > <log> 2>&1`.
- X7, X8, X9, X10: `FORCE_COLOR=0 bunx jest src/components/__tests__/pet-switcher.test.tsx -t '#184 R3:' > <log> 2>&1`.
- X11, X12, X13, X14: `FORCE_COLOR=0 bunx jest src/screens/profile/index.test.tsx -t '#184 R4:' > <log> 2>&1`.

Los diagnósticos X1-counter y X2-counter reordenaron una aserción temporalmente, sin modificar el test definitivo. X1–X15 ejecutadas, rojos capturados y todas retiradas.

## Verificación y commits

Cada commit de código fue encadenado con Jest del fichero entero, ausencia de router.d.ts, TSC y git add de la ruta exacta, antes de git commit. El commit de R2-test exige exit 1 con exactamente el rojo previsto; los demás exigen exit 0.

| Commit | Mensaje | Verificación del fichero |
|---|---|---|
| `54770013` | `test(profile): wait for the me-card name instead of the skeleton card (R5)` | 142 passed, 142 total; TSC exit 0 |
| `178486b5` | `test(profile): lock the camera disabled prop during upload (R1)` | 143 passed, 143 total; TSC exit 0 |
| `b9daabb7` | `test(components): lock avatar photo size and cacheKey in PetSwitcher (R3)` | 8 passed, 8 total; TSC exit 0 |
| `fe2e5f81` | `test(profile): lock the sign-out button variant and classes (R4)` | 144 passed, 144 total; TSC exit 0 |
| `5221b327` | `test(profile): require a reentry guard on the photo picker (R2)` | 1 failed, 151 passed, 152 total; TSC exit 0 |
| `1dbda4bd` | `fix(profile): ignore photo taps while a picker or upload is in flight (R2)` | 152 passed, 152 total; TSC exit 0 |
| Este commit final | `docs(profile): trazabilidad de #184` | Evidencia y trazabilidad; el hash final se imprime al cerrar y queda resoluble por este mensaje en el historial. |

### Cierre medido

- `FORCE_COLOR=0 bunx jest src/screens/profile/index.test.tsx src/components/__tests__/pet-switcher.test.tsx > /tmp/pet-tracker-184.kyzq_jcv/final-files.log 2>&1`: exit 0, 160 passed (152 Perfil + 8 PetSwitcher).
- `FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/pet-tracker-184.kyzq_jcv/R6-design-drift.log 2>&1`: exit 0, 114 passed.
- `bunx eslint src/screens/profile/index.tsx src/screens/profile/index.test.tsx src/components/__tests__/pet-switcher.test.tsx > /tmp/pet-tracker-184.kyzq_jcv/final-eslint.log 2>&1`: exit 0, sin salida.
- `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/pet-tracker-184.kyzq_jcv/final-tsc.log 2>&1`: exit 0, sin salida. La ausencia de router.d.ts se comprobó antes de cada TSC; nunca se borró.
- `git diff --check`: exit 0. Anclas finales: disabled 1; className de sign-out 1; size/cacheKey de PetSwitcher 1; photoBusyRef 4; findByText Ada 1; getByText Ada 0.
- Historial: seis commits de código ya medidos más este séptimo commit de documentación. El cierre exige `git rev-list --count 6a581de8..HEAD` = **7**, conserva el resultado en `/tmp/pet-tracker-184.kyzq_jcv/postcommit-audit.log` y verifica working tree limpio antes de crear el marcador. No se rebaseó.
- El hash literal del commit que contiene este informe no puede incluirse a sí mismo; los seis hashes de código están arriba y el séptimo se obtiene por su mensaje exacto. La auditoría externa del cierre contiene el hash final.

La lista final de `git diff --name-only 6a581de8..HEAD`, idéntica a la medida del índice al cerrar, queda limitada a estos cinco ficheros:

```text
mobile-pet-tracker/src/components/__tests__/pet-switcher.test.tsx
mobile-pet-tracker/src/screens/profile/index.test.tsx
mobile-pet-tracker/src/screens/profile/index.tsx
progress/impl_mobile-profile-followups.md
specs/mobile-profile-followups/traceability.md
```

### Entrega al leader

Implementación y evidencia R1–R6 listas; el estado de la feature se conserva en in_progress. La suite completa `./init.sh`, revisión y PR quedan a cargo del leader como indica el handoff. El desvío X3 está documentado sin ajustar requisitos. No se hizo push ni se abrió/editó PR.

Última acción del cierre: crear `progress/impl_mobile-profile-followups.done` con una sola línea, la ruta absoluta de este informe; fichero ignorado y sin commit. La auditoría final comprueba el alcance y los siete commits antes de emitirlo.
