---
feature: "mobile-no-pets-states-and-centered-content"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — mobile-no-pets-states-and-centered-content

Implementación contra la enmienda aprobada y firmada en `a64859d8`.
Rutas de tests relativas a `mobile-pet-tracker/`. Los identificadores c1–c12
remiten al registro de hashes y mensajes completo que sigue a la tabla.
Solo el smoke requiere ejecución humana; no se modifica el estado de la feature.

| Requisito | Test (archivo::nombre) | Commit (hash; mensaje en registro) |
|---|---|---|
| R1 (S1–S4 en tres pantallas; S5 en Perfil) | `src/screens/home/index.test.tsx`, `src/screens/profile/index.test.tsx`, `src/screens/reminders/index.test.tsx` :: `#181 R1` (13 casos) | c1 `f08797a6`; c3 `2f1165f3`; c5 `d74224cc`; c7 `f90f7d57`; c9 `1af399ba` |
| R2.1 (clearPet en el proveedor) | `src/providers/__tests__/selected-pet-provider.test.tsx` :: `#181 R2: clearPet pertenece a la sesión` (expone y borra; identidad; reinicio por token) | c2 `45a13f42`; c3 `2f1165f3` |
| R2.2 (limpieza con lista ok vacía) | `src/hooks/use-pet-selection.test.tsx` :: `R2.2: limpia exactamente una vez con lista ok vacía y selección rancia` | c2 `45a13f42`; c3 `2f1165f3` |
| R2.3 (condiciones que no limpian) | `src/hooks/use-pet-selection.test.tsx` :: `R2.3: no limpia sin foco`, `durante la revalidación`, `una selección ya nula`, `sin datos`, `con kind %s` (4 kind); tests existentes de lista no vacía | c2 `45a13f42`; c3 `2f1165f3` |
| R2.4 (escritor único y firma intacta) | `src/hooks/use-pet-selection.test.tsx` :: `R2.4: solo proveedor y hook mencionan clearPet en producción`; bloque existente `#87 R8` | c2 `45a13f42`; c3 `2f1165f3` |
| R2.5 (17 dobles exhaustivos) | `src/screens/add-pet/index.test.tsx` (14), `src/screens/alert-detail/index.test.tsx` (1), dobles previos del hook (2); `bun run typecheck` exit 0 | c3 `2f1165f3` |
| R3.1 (Inicio sin tarjeta con selección nula) | `src/screens/home/index.test.tsx` :: `#181 R1` S2 y `S4: lista unreachable y selección nula ocultan la tarjeta` | c1 `f08797a6`; c5 `d74224cc` |
| R3.2 (Inicio centrado) | `src/screens/home/index.test.tsx` :: `#181 R3` / `R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena`; `#155 R4` enmendado | c4 `c5170de1`; c5 `d74224cc` |
| R3.3 (carga y error intactos) | `src/screens/home/index.test.tsx` :: `shows a loading state while pets are pending`, `pads the content below the status bar with the top safe-area inset`, `shows an error and retries the pet list` (sin editar) | c5 `d74224cc` |
| R4.1 (Recordatorios sin tarjeta) | `src/screens/reminders/index.test.tsx` :: `#181 R1` S1–S4; S4 detecta X6 | c1 `f08797a6`; c7 `f90f7d57` |
| R4.2 (Recordatorios centrado) | `src/screens/reminders/index.test.tsx` :: `#181 R4` / `R4.2: centra solo el vacío y retira los controles que necesitan mascota`, `R4.2: muestra Pingo talk, copy español y una acción hacia pets/add` | c6 `88228369`; c7 `f90f7d57` |
| R4.3 (rama con mascotas intacta) | `src/screens/reminders/index.test.tsx` :: `R4.3: con mascota mantiene el scroll y el vacío de recordatorios`; bloques existentes `#178` y `#155 R6` sin editar | c6 `88228369`; c7 `f90f7d57` |
| R5.1 (Perfil ilustrado) | `src/screens/profile/index.test.tsx` :: `R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir`; 3 tests previos de M16 sin editar | c8 `c8133255`; c9 `1af399ba` |
| R5.2 (sin tarjeta ni esqueletos) | `src/screens/profile/index.test.tsx` :: `#181 R1` S1–S5; `R5.2 R5.3: centra en horizontal dentro del scroll y mantiene las acciones de cuenta` | c1 `f08797a6`; c8 `c8133255`; c9 `1af399ba` |
| R5.3 (centrado horizontal) | `src/screens/profile/index.test.tsx` :: `R5.2 R5.3: centra en horizontal dentro del scroll y mantiene las acciones de cuenta` | c8 `c8133255`; c9 `1af399ba` |
| R6 (Comida y Salud heredan la raíz) | `src/app/(tabs)/__tests__/food.test.tsx`, `src/screens/health/index.test.tsx` :: `#181 R6` / `elimina la selección rancia y conserva el estado vacío`; rojas con X1 | c10 `2af02ae5` |
| R7 (primera mascota) | `src/screens/home/index.test.tsx` :: `#181 R7` / `limpia la selección rancia y selecciona la mascota que llega al revalidar la lista`; roja con X1 | c10 `2af02ae5` |
| R8.1 (copy +2 y +3) | `src/__tests__/ui-language.test.ts` :: `#65 R7`, `#65 R8`, `#65 R18`; `checkUses(ALL_USES)` y `SCREEN_FILES` conservados | c6 `88228369`; c8 `c8133255` |
| R8.2 (inventario EmptyState) | `src/components/__tests__/empty-state.test.tsx` :: `%s pinta %i EmptyState`, `ningún otro fichero usa EmptyState`, tabla de vacíos en texto (11 filas); lista de 9 comprobada con Node y sort() | c6 `88228369`; c8 `c8133255` |
| R8.3 (design-drift y legibilidad) | `src/__tests__/design-drift.test.ts`, `src/__tests__/legibility-classnames.test.ts`; guardas 13 suites / 329 tests, exit 0 | c7 `f90f7d57`; c9 `1af399ba`; c12 `78313d6a` |
| R9 (A20 y firma tolerante) | `src/__tests__/no-pets-states.test.ts` :: `declara una sola enmienda A20 de #181`, `declara la casilla de aprobación y admite la firma humana`; `docs/ui-guidelines.md` sin cambios | c11 `9fe88151`; c12 `78313d6a` |
| R10 (mutaciones; X5 equivalente) | Registro empírico de X1–X4 y X6–X12 debajo; S3 sigue verde con X1; todos los mutantes revertidos | c13: este commit documental; base verde c12 `78313d6a` |
| Smoke dev build de Android (humano) | pendiente del humano, conforme al handoff | pendiente del humano |

## Registro de commits

| Paso | Hash | Mensaje |
|---|---|---|
| c1 | `f08797a6d07fc6c8492047d4a63973bbf3cba456` | test(mobile): prueba estados sin mascotas en trece escenarios (R1) |
| c2 | `45a13f421909fabdf85c35d942e4dbd2456d74bf` | test(mobile): verifica limpieza y escritor único de selección (R2) |
| c3 | `2f1165f3ba8f3e65b22443a6331322b859c4b8b7` | feat(mobile): limpia la selección cuando la lista queda vacía (R2) |
| c4 | `c5170de1fa5c4eb0987850fcd74e5d472727945d` | test(mobile): exige el vacío de Inicio fuera del scroll (R3) |
| c5 | `d74224cce4202d19b1985df77d80fa569e961a85` | feat(mobile): centra el estado de Inicio sin mascotas (R3) |
| c6 | `8822836986d0c43e60a7f61b231eca8a5445684e` | test(mobile): exige el vacío de cuenta en Recordatorios (R4,R8) |
| c7 | `f90f7d57c0232643924196a2e900959cad490895` | feat(mobile): centra la cuenta sin mascotas en Recordatorios (R4) |
| c8 | `c813325545c43ff1ab0a9de6d71e08183082b2a5` | test(mobile): exige el vacío ilustrado dentro de Perfil (R5,R8) |
| c9 | `1af399ba1d16419be18c019dd8eb578fe3bcd64b` | feat(mobile): ilustra el vacío de Perfil y oculta sus errores (R5) |
| c10 | `2af02ae5cc1b0b1b74fcba2a8a8f17def6862d65` | test(mobile): prueba limpieza heredada y primera mascota (R6,R7) |
| c11 | `9fe88151d7795f49e9c98ecb4597f223a9af615a` | test(mobile): exige la enmienda A20 y su firma tolerante (R9) |
| c12 | `78313d6a3ef0bf24d55aca8867354394f45ed4e2` | docs(mobile-no-pets-states-and-centered-content): documenta excepción A20 (R9) |
| c13 | este commit (`git log -1 --format=%H -- specs/mobile-no-pets-states-and-centered-content/traceability.md`) | docs(mobile-no-pets-states-and-centered-content): registra mutaciones y trazabilidad (R10) |

## Registro empírico R10

Todas las mutaciones se plantaron por separado sobre c12 `78313d6a`.
Tras cada corrida se restauró su archivo con `git checkout HEAD -- <ruta>`
y se comprobó `git diff --quiet && git diff --cached --quiet` antes de la
siguiente. Los fallos son aserciones, sin errores de símbolo ni de ejecución.
La tabla identifica el commit que introdujo cada sonda.

| Mutación | Resultado | Archivo::it que cae | Commit de la sonda |
|---|---|---|---|
| X1 | 7 rojo(s); 3 verde(s) | `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R7: Inicio converge al crear la primera mascota limpia la selección rancia y selecciona la mascota que llega al revalidar la lista<br>`src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/app/(tabs)/__tests__/food.test.tsx` :: #181 R6: food hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/screens/health/index.test.tsx` :: #181 R6: health hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.2: limpia exactamente una vez con lista ok vacía y selección rancia | c1 `f08797a6`; c10 `2af02ae5`; c2 `45a13f42` |
| X2 | 1 rojo(s); 0 verde(s) | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia durante la revalidación | c2 `45a13f42` |
| X3 | 4 rojo(s); 0 verde(s) | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind error<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unreachable<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind missing-config<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unauthorized | c2 `45a13f42` |
| X4 | 1 rojo(s); 0 verde(s) | `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | c1 `f08797a6` |
| X6 | 1 rojo(s); 0 verde(s) | `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | c1 `f08797a6` |
| X7 | 1 rojo(s); 0 verde(s) | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S5: lista vacía revalidando y detalle pendiente no muestran esqueletos | c1 `f08797a6` |
| X8 | 1 rojo(s); 0 verde(s) | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | c1 `f08797a6` |
| X9 | 2 rojo(s); 0 verde(s) | `src/screens/home/index.test.tsx` :: #155 R4: Inicio sin mascotas presenta a Pingo queda en el sitio del vacío que sustituye (enmendado por #181 R3)<br>`src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | c4 `c5170de1` |
| X10 | 1 rojo(s); 1 verde(s) | `src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | c4 `c5170de1` |
| X11 | 1 rojo(s); 0 verde(s) | `src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir | c8 `c8133255` |
| X12 | 1 rojo(s); 0 verde(s) | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.4: solo proveedor y hook mencionan clearPet en producción | c2 `45a13f42` |
| X5 | equivalente; no plantada según la spec | El retorno anticipado de Recordatorios hace inobservable quitar `!petsEmpty` de su tarjeta | exención aprobada en `a64859d8` |

X1: las tres S3 de Inicio, Perfil y Recordatorios siguieron verdes. La raíz
no enmascara las defensas de pantalla. X9 hace caer tanto R3.2 como el test
anterior de `#155 R4` enmendado. X10 deja verde ese test anterior y pone rojo
R3.2, que lee la clase del propio contenedor.

Tras restaurar X12: 37 tests nuevos de `^#181 R` verdes (8 suites), seguidos
de 13 suites / 329 tests de `src/__tests__` verdes. La verificación previa
acotada completa de archivos afectados dio 10 suites / 837 tests verdes;
typecheck y lint sin caché terminaron con exit 0.
