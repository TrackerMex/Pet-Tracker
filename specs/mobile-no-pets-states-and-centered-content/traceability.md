---
feature: "mobile-no-pets-states-and-centered-content"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — mobile-no-pets-states-and-centered-content

Implementación contra la enmienda aprobada y firmada en `a64859d8` y la vía de verificación R8 firmada en `d3fab6ed`.
Rutas de tests relativas a `mobile-pet-tracker/`. Los identificadores c1–c12
remiten al registro de hashes y mensajes completo que sigue a la tabla.
No se modifica el estado de la feature. B1 continúa sin arreglo demostrado.

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
| R8.1 (copy y catálogo) | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos | Test existente `8da45c961ebfaf211e95213f7cf88a107813dc81`; rojo `abc4ff8c4619154775d4ed47e428ed4081b06d16`; verde `393002ab0f3228c65c4b89ca5b8b855ef73e4d42`; también M2 rojo `7e1f50aa620a69f3e8f4f94c5076b9b409007a20` / verde `04a0a9366ffe429501ea624ec2f71a06a39bb147` |
| R8.2 (inventario EmptyState) | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios | Test existente `8da45c961ebfaf211e95213f7cf88a107813dc81`; rojo `7e1f50aa620a69f3e8f4f94c5076b9b409007a20`; verde `04a0a9366ffe429501ea624ec2f71a06a39bb147` |
| R8.3 (sin drift) | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.3: mantiene las tres pantallas sin drift de estilos; guardas conservadas | Test existente `8da45c961ebfaf211e95213f7cf88a107813dc81`; rojo `169006a227c090ad2223bf505b1f0a8989b3197c`; verde `7fa5a6409bf87f3eb415bad7cee07b440c3e6bb9` |
| R9 (A20 y firma tolerante) | `src/__tests__/no-pets-states.test.ts` :: `declara una sola enmienda A20 de #181`, `declara la casilla de aprobación y admite la firma humana`; `docs/ui-guidelines.md` sin cambios | c11 `9fe88151`; c12 `78313d6a` |
| R10 (mutaciones; X5 equivalente) | Tabla conservada de ronda 2 debajo; X9/X10 en ambas pantallas; S3 verde con X1 | Árbol medido `8da45c961ebfaf211e95213f7cf88a107813dc81`; evidencia versionada en `39369bf37659fd4a57a6c81ced6a1beca0b68573`; no re-medida en ronda 3, sin commit B1 |
| B1 (picker de Perfil) | Ronda 3 sin cambios: Perfil 138/138; combinación serial 429/429; tres completas 113 suites / 3759 tests verdes, sin reproducción determinista | sin arreglo: diagnóstico en el informe |

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
| c13 | `6d3233181ebf033c3cbc510c9d1b3c222bc48b71` | docs(mobile-no-pets-states-and-centered-content): registra mutaciones y trazabilidad (R10) |
| r2-R8 | `8da45c961ebfaf211e95213f7cf88a107813dc81` | test(mobile): exige los candados agregados de R8 (R8) |
| r3-R8-M1-rojo | `abc4ff8c4619154775d4ed47e428ed4081b06d16` | test(mobile): candado R8-M1 en Perfil, mutación versionada en rojo (R8) |
| r3-R8-M1-verde | `393002ab0f3228c65c4b89ca5b8b855ef73e4d42` | test(mobile): candado R8-M1 en Perfil, mutación revertida en verde (R8) |
| r3-R8-M2-rojo | `7e1f50aa620a69f3e8f4f94c5076b9b409007a20` | test(mobile): candado R8-M2 en Perfil, mutación versionada en rojo (R8) |
| r3-R8-M2-verde | `04a0a9366ffe429501ea624ec2f71a06a39bb147` | test(mobile): candado R8-M2 en Perfil, mutación revertida en verde (R8) |
| r3-R8-M3-rojo | `169006a227c090ad2223bf505b1f0a8989b3197c` | test(mobile): candado R8-M3 en Perfil, mutación versionada en rojo (R8) |
| r3-R8-M3-verde | `7fa5a6409bf87f3eb415bad7cee07b440c3e6bb9` | test(mobile): candado R8-M3 en Perfil, mutación revertida en verde (R8) |

## R8 — pares versionados de la ronda 3

| Par | B_k | Commit rojo | Commit verde | Rojo (EXIT=1) | Verde (EXIT=0) |
|---|---|---|---|---|---|
| R8-M1 | `00abcc940eb272860a144df15091a2bb4e6d3683` | `abc4ff8c4619154775d4ed47e428ed4081b06d16` | `393002ab0f3228c65c4b89ca5b8b855ef73e4d42` | Test Suites: 1 failed, 1 total; Tests: 1 failed, 6 passed, 7 total | Test Suites: 1 passed, 1 total; Tests: 7 passed, 7 total |
| R8-M2 | `393002ab0f3228c65c4b89ca5b8b855ef73e4d42` | `7e1f50aa620a69f3e8f4f94c5076b9b409007a20` | `04a0a9366ffe429501ea624ec2f71a06a39bb147` | Test Suites: 1 failed, 1 total; Tests: 2 failed, 5 passed, 7 total | Test Suites: 1 passed, 1 total; Tests: 7 passed, 7 total |
| R8-M3 | `04a0a9366ffe429501ea624ec2f71a06a39bb147` | `169006a227c090ad2223bf505b1f0a8989b3197c` | `7fa5a6409bf87f3eb415bad7cee07b440c3e6bb9` | Test Suites: 2 failed, 2 total; Tests: 2 failed, 115 passed, 117 total | Test Suites: 2 passed, 2 total; Tests: 117 passed, 117 total |

| Mutación | Archivo | Nombre completo del it que cae por aserción |
|---|---|---|
| R8-M1 | `src/__tests__/no-pets-states.test.ts` | #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos |
| R8-M2 | `src/__tests__/no-pets-states.test.ts` | #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos |
| R8-M2 | `src/__tests__/no-pets-states.test.ts` | #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios |
| R8-M3 | `src/__tests__/no-pets-states.test.ts` | #181 R8: candados agregados y de catálogo #181 R8.3: mantiene las tres pantallas sin drift de estilos |
| R8-M3 | `src/__tests__/design-drift.test.ts` | R9: mobile-pets-profile sin drift keeps arbitrary text, hex colors, and StyleSheet out of feature sources |

Cada B_k tenía ambos diffs vacíos y no-pets-states verde (1 suite / 7 tests).
Los rojos solo versionan la mutación de Perfil; los verdes restauran exactamente
su B_k. `git diff --quiet B_k HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`
salió 0 al cerrar cada par. La restauración estaba en el índice y el diff sin
indexar vacío antes de cada verde. Al cerrar los tres pares, el estado era limpio.
M3 se corrió con no-pets-states y design-drift, en ese orden. Cero it añadidos.

## R10 — medición conservada de la ronda 2

No hay commit B1: el handoff de ronda 3 exige conservar esta tabla sin repetirla.
Fuente versionada: `39369bf37659fd4a57a6c81ced6a1beca0b68573`. Base medida: `8da45c961ebfaf211e95213f7cf88a107813dc81`
(objeto tree `a8ff384773119cdb68afb347cb69d1f56b44402b`).
Producción, tests y configuración de mobile son idénticos a esa base después
de cerrar los pares R8. Sus ficheros de referencia pasaron antes de mutar:
10 suites / 831 tests. Las 13 mediciones R10 dan 30 fallos de aserción;
no hubo errores de compilación, ReferenceError o TypeError. Las suites
coincidieron con las rutas literales de --runTestsByPath en cada medición.

| Mutación | Cambio | Resultado de suites | Tests rojos / verdes | Archivo :: nombre completo del test que cae | Commit de referencia |
|---|---|---|---|---|---|
| X1 | Hook: eliminar la línea de clearPet de la rama vacía | 6 failed, 1 passed, 7 total | 7 / 607 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R7: Inicio converge al crear la primera mascota limpia la selección rancia y selecciona la mascota que llega al revalidar la lista<br>`src/app/(tabs)/__tests__/food.test.tsx` :: #181 R6: food hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/health/index.test.tsx` :: #181 R6: health hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.2: limpia exactamente una vez con lista ok vacía y selección rancia | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X2 | Hook: eliminar la guarda común isRefreshing | 1 failed, 1 total | 3 / 14 | `src/hooks/use-pet-selection.test.tsx` :: R10: usePetSelection respeta el foco y la revalidación no pisa la selección mientras la pantalla enfocada revalida<br>`src/hooks/use-pet-selection.test.tsx` :: #87 R8: usePetSelection acepta la forma mínima y no conoce use-api does not select while the minimal source shape is refreshing<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia durante la revalidación | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X3 | Hook: llamar clearPet antes de retornar con kind no ok | 1 failed, 1 total | 5 / 12 | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia sin datos<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind error<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unreachable<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind missing-config<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unauthorized | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X4 | Inicio: quitar selectedPetId !== null de pet-hero-error | 1 failed, 1 passed, 2 total | 1 / 233 | `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X5 | Quitar !petsEmpty de reminders-error | equivalente; no plantada | — | El retorno anticipado elimina el scroll cuando petsEmpty es verdadero | `8da45c961ebfaf211e95213f7cf88a107813dc81`; exención de la spec firmada `a64859d8` |
| X6 | Recordatorios: quitar selectedPetId !== null de reminders-error | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X7 | Perfil: quitar && !petsEmpty de petLoading | 1 failed, 1 passed, 2 total | 1 / 144 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S5: lista vacía revalidando y detalle pendiente no muestran esqueletos | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X8 | Perfil: quitar selectedPetId !== null de profile-pet-error | 1 failed, 1 passed, 2 total | 1 / 144 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X9-home | Inicio: trasladar EmptyState al scroll, sin retorno anticipado | 1 failed, 1 passed, 2 total | 3 / 231 | `src/screens/home/index.test.tsx` :: #155 R4: Inicio sin mascotas presenta a Pingo queda en el sitio del vacío que sustituye (enmendado por #181 R3)<br>`src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X9-reminders | Recordatorios: trasladar EmptyState al scroll, sin retorno anticipado | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R4: Recordatorios distingue una cuenta sin mascotas R4.2: centra solo el vacío y retira los controles que necesitan mascota | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X10-home | Inicio: justify-center → justify-start | 1 failed, 1 passed, 2 total | 1 / 233 | `src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X10-reminders | Recordatorios: justify-center → justify-start | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R4: Recordatorios distingue una cuenta sin mascotas R4.2: centra solo el vacío y retira los controles que necesitan mascota | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X11 | Perfil: sustituir EmptyState por el Text anterior | 2 failed, 2 total | 4 / 141 | `src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir<br>`src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.2 R5.3: centra en horizontal dentro del scroll y mantiene las acciones de cuenta<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X12 | Inicio: añadir clearPet a la desestructuración y ejecutar clearPet() | 1 failed, 1 passed, 2 total | 1 / 23 | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.4: solo proveedor y hook mencionan clearPet en producción | `8da45c961ebfaf211e95213f7cf88a107813dc81` |

### Independencia de S3 con X1

- `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.
- `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.
- `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.

X2 elimina la guarda real `if (pets.isRefreshing) return;`, situada antes de ambas
ramas del hook: protege tanto la limpieza como la selección automática. Por eso
caen R2.3 y los dos candados anteriores de revalidación. La diferencia con el
texto «de la rama de limpieza» de la spec se conserva explícitamente.

X3 cae con los cuatro kind exigidos y, además, sin datos. X4, X6, X7 y X8
caen por S4 de Inicio, S4 de Recordatorios, S5 de Perfil y S4 de Perfil,
respectivamente; no se atribuye su detección a S2 o S3. X9 y X10 se midieron
por separado en Inicio y Recordatorios. X9-Inicio cae además en S3 y #155 R4;
X11 cae también en R8.1/R8.2. X12 añade `clearPet` a la desestructuración de
Inicio y ejecuta `clearPet()` allí; se verifica por el escaneo del hook,
sin renderizar la pantalla mutada. X5 es equivalente y no se planta:
`petsEmpty` ya retiró el scroll mediante el retorno anticipado de R4.2.

## Verificación final de ronda 3

HEAD verificado: `7fa5a6409bf87f3eb415bad7cee07b440c3e6bb9`.
Typecheck y lint sin caché: EXIT=0; lint 0 bytes. Perfil + no-pets-states +
design-drift: Test Suites: 3 passed, 3 total; Tests: 255 passed, 255 total.
Guardas `bunx jest src/__tests__`: Test Suites: 13 passed, 13 total;
Tests: 334 passed, 334 total. El commit de cierre solo incorpora documentación.
B1: sin arreglo; diagnóstico en el informe. No se añade ninguna fila de smoke.
