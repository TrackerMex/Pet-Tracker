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
| R8.1 (copy y catálogo) | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos | `8da45c961ebfaf211e95213f7cf88a107813dc81` — test(mobile): exige los candados agregados de R8 (R8) |
| R8.2 (inventario EmptyState) | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios | `8da45c961ebfaf211e95213f7cf88a107813dc81` — test(mobile): exige los candados agregados de R8 (R8) |
| R8.3 (sin drift) | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.3: mantiene las tres pantallas sin drift de estilos; guardas conservadas | `8da45c961ebfaf211e95213f7cf88a107813dc81` — test(mobile): exige los candados agregados de R8 (R8) |
| R9 (A20 y firma tolerante) | `src/__tests__/no-pets-states.test.ts` :: `declara una sola enmienda A20 de #181`, `declara la casilla de aprobación y admite la firma humana`; `docs/ui-guidelines.md` sin cambios | c11 `9fe88151`; c12 `78313d6a` |
| R10 (mutaciones; X5 equivalente) | Tabla de mediciones de la ronda 2 debajo; X9/X10 en ambas pantallas; S3 verde con X1 | Árbol de referencia `8da45c961ebfaf211e95213f7cf88a107813dc81`; informe de la ronda 2 |
| B1 (picker de Perfil) | No reproducido: Perfil aislado, combinación de 3 ficheros y 3 corridas completas verdes; instrumentación añadida y revertida | sin arreglo: diagnóstico en el informe |
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
| c13 | `6d3233181ebf033c3cbc510c9d1b3c222bc48b71` | docs(mobile-no-pets-states-and-centered-content): registra mutaciones y trazabilidad (R10) |
| r2-R8 | `8da45c961ebfaf211e95213f7cf88a107813dc81` | test(mobile): exige los candados agregados de R8 (R8) |

## Registro empírico R8 y R10 — ronda 2

Las mediciones que siguen sustituyen el registro anterior para esta revisión.
Todas usan HEAD `8da45c961ebfaf211e95213f7cf88a107813dc81` como base, después del commit R8 de esta ronda.
Antes de cada mutación y después de restaurarla con
`git checkout HEAD -- <ruta>` pasaron `git diff --quiet` y
`git diff --cached --quiet`. Cada archivo de referencia pasó sin mutar:
10 suites / 831 tests verdes. Las corridas de la tabla usan archivos concretos
con --runTestsByPath; su número coincide con la línea Test Suites en todos los
casos. No hubo errores de compilación, ReferenceError ni TypeError: los 38
fallos de las 16 mediciones son de aserción. X5 es equivalente y no se planta.

| Mutación | Cambio | Resultado de suites | Tests rojos / verdes | Archivo :: nombre completo del test que cae | Commit de referencia |
|---|---|---|---|---|---|
| R8-M1 | Perfil: body common.noPetsBody → common.noPetsYet | 2 failed, 2 total | 2 / 143 | `src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| R8-M2 | Perfil: EmptyState de petsEmpty → expresión null | 2 failed, 2 total | 4 / 104 | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios<br>`src/components/__tests__/empty-state.test.tsx` :: #155 R10: los vacíos que no se ilustran siguen en texto src/screens/profile/index.tsx pinta 1 EmptyState<br>`src/components/__tests__/empty-state.test.tsx` :: #155 R10: los vacíos que no se ilustran siguen en texto ningún otro fichero usa EmptyState | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| R8-M3 | Perfil: comentario // #181 E4 | 2 failed, 2 total | 2 / 115 | `src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.3: mantiene las tres pantallas sin drift de estilos<br>`src/__tests__/design-drift.test.ts` :: R9: mobile-pets-profile sin drift keeps arbitrary text, hex colors, and StyleSheet out of feature sources | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X1 | Hook: eliminar la línea de clearPet de la rama vacía | 6 failed, 1 passed, 7 total | 7 / 607 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R7: Inicio converge al crear la primera mascota limpia la selección rancia y selecciona la mascota que llega al revalidar la lista<br>`src/app/(tabs)/__tests__/food.test.tsx` :: #181 R6: food hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento<br>`src/screens/health/index.test.tsx` :: #181 R6: health hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.2: limpia exactamente una vez con lista ok vacía y selección rancia | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X2 | Hook: eliminar la guarda común isRefreshing | 1 failed, 1 total | 3 / 14 | `src/hooks/use-pet-selection.test.tsx` :: R10: usePetSelection respeta el foco y la revalidación no pisa la selección mientras la pantalla enfocada revalida<br>`src/hooks/use-pet-selection.test.tsx` :: #87 R8: usePetSelection acepta la forma mínima y no conoce use-api does not select while the minimal source shape is refreshing<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia durante la revalidación | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X3 | Hook: llamar clearPet antes de retornar con kind no ok | 1 failed, 1 total | 5 / 12 | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia sin datos<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind error<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unreachable<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind missing-config<br>`src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unauthorized | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X4 | Inicio: quitar selectedPetId !== null de pet-hero-error | 1 failed, 1 passed, 2 total | 1 / 233 | `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X6 | Recordatorios: quitar selectedPetId !== null de reminders-error | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X7 | Perfil: quitar && !petsEmpty de petLoading | 1 failed, 1 passed, 2 total | 1 / 144 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S5: lista vacía revalidando y detalle pendiente no muestran esqueletos | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X8 | Perfil: quitar selectedPetId !== null de profile-pet-error | 1 failed, 1 passed, 2 total | 1 / 144 | `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X9-home | Inicio: trasladar EmptyState al scroll, sin retorno anticipado | 1 failed, 1 passed, 2 total | 3 / 231 | `src/screens/home/index.test.tsx` :: #155 R4: Inicio sin mascotas presenta a Pingo queda en el sitio del vacío que sustituye (enmendado por #181 R3)<br>`src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento<br>`src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X9-reminders | Recordatorios: trasladar EmptyState al scroll, sin retorno anticipado | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R4: Recordatorios distingue una cuenta sin mascotas R4.2: centra solo el vacío y retira los controles que necesitan mascota | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X10-home | Inicio: justify-center → justify-start | 1 failed, 1 passed, 2 total | 1 / 233 | `src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X10-reminders | Recordatorios: justify-center → justify-start | 1 failed, 1 passed, 2 total | 1 / 70 | `src/screens/reminders/index.test.tsx` :: #181 R4: Recordatorios distingue una cuenta sin mascotas R4.2: centra solo el vacío y retira los controles que necesitan mascota | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X11 | Perfil: sustituir EmptyState por el Text anterior | 2 failed, 2 total | 4 / 141 | `src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir<br>`src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.2 R5.3: centra en horizontal dentro del scroll y mantiene las acciones de cuenta<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.1: conserva las filas del catálogo y el copy de los vacíos<br>`src/__tests__/no-pets-states.test.ts` :: #181 R8: candados agregados y de catálogo #181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X12 | Inicio: añadir clearPet a la desestructuración y ejecutar clearPet() | 1 failed, 1 passed, 2 total | 1 / 23 | `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.4: solo proveedor y hook mencionan clearPet en producción | `8da45c961ebfaf211e95213f7cf88a107813dc81` |
| X5 | Quitar !petsEmpty de reminders-error | equivalente; no plantada | — | El retorno anticipado elimina el scroll cuando petsEmpty es verdadero | `8da45c961ebfaf211e95213f7cf88a107813dc81`; exención de la spec firmada `a64859d8` |

### Independencia de S3 con X1

- `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.
- `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.
- `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S3: conserva el vacío sin tarjeta ni reintento — **verde**.

X2: la guarda eliminada está antes de las ramas y protege tanto la limpieza
como la selección automática. Por eso caen también las dos pruebas anteriores
sobre revalidación, además de R2.3. Se plantó la línea real del código, conforme
al handoff. X3 cae con los cuatro kind exigidos y, adicionalmente, con datos
indefinidos. X1 hace caer R7 como consecuencia adicional de no limpiar.

X4, X6, X7 y X8 caen únicamente en el escenario previsto: S4 de Inicio, S4 de
Recordatorios, S5 de Perfil y S4 de Perfil, respectivamente. No se atribuye
su detección a S2 ni a S3. X9-Inicio hace caer además S3 y el candado anterior
#155 R4 enmendado, porque el retorno anticipado también es su defensa de error.
X10 conserva verde ese candado anterior y cae la prueba que lee la clase del
contenedor. X11 cae también en R8.1/R8.2; R8-M2 cae además en el inventario
compartido, y R8-M3 también en design-drift. Todos esos nombres están en la tabla.

Tras restaurar todo: tests de Perfil y no-pets-states, 2 suites / 145 tests verdes; guardas, 13 suites / 334 tests verdes. Typecheck y lint sin caché: exit 0. B1 sigue no resuelto; el informe detalla la instrumentación y las tres corridas completas. Smoke Android: pendiente del humano.
