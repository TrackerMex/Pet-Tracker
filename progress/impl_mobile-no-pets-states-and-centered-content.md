# Informe de implementación — #181

Implementación de R1–R10 completada según la enmienda aprobada `a64859d8`,
con c1–c13 en orden. Solo queda el smoke Android del humano. No se marca la
feature done: el gate completo y la revisión corresponden al leader.
Este informe sustituye el preflight anterior, cuyos bloqueos fueron corregidos
en la spec y el handoff antes de c1.

## Entorno y base

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-181` (coincide).
- `git branch --show-current`: `feature/181-mobile-no-pets-states-and-centered-content` (coincide).
- H0: `44acd74b`.
- HANDOFF: `e10cd68944370b6590c1193fe6665f7f05ad4d9b`.
- Antes de c1, `git diff --stat 44acd74b HEAD -- docs mobile-pet-tracker` vacío;
  anclas medidas de nuevo por contenido sobre ese árbol.
- `node_modules` ya instalado; Bun 1.4.0. No se instalaron dependencias.
- Leídos requirements completos, design, tasks, traceability e instrucciones
  de raíz/móvil; arquitectura, convenciones, carta UI y verificación aplicables.
- Consultada la documentación versionada de [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).

## Resultado

El proveedor expone `clearPet` con identidad estable por token. Solo el hook
decide limpiar, con pantalla enfocada, sin revalidación y lista ok vacía.
Las listas pendientes o fallidas conservan la selección. Los 17 dobles previos
se actualizaron y el typecheck pasa.

Inicio y Recordatorios sustituyen el scroll por el contenedor exacto
`flex-1 items-center justify-center p-6 bg-background`. Perfil conserva el
scroll de cuenta y centra su EmptyState en horizontal, con los dos botones
«Añadir mascota» previstos. Los errores no conviven con el vacío; Perfil
suprime además sus esqueletos de mascota en ese estado. Copy, pose y navegación
se verifican en el árbol. La petición manual con selección nula sigue siendo
la deuda de #193: no se cambió el refetch al enfocar.

## M1–M19 antes de c1

| Ancla | Medida real en H0 | Comparación y resultado |
|---|---|---|
| M1 | 1 pet-hero-error | coincide; sigue 1 |
| M2 | 1 profile-pet-error | coincide; sigue 1 |
| M3 | 1 reminders-error | coincide; sigue 1 |
| M4 | 1 condición pets.data.pets.length === 0 en Inicio | coincide; trasladada al retorno anticipado |
| M5 | EmptyState Inicio / Perfil / Recordatorios = 1 / 0 / 1 | coincide; final 1 / 1 / 2 |
| M6 | 1 profile-pets-empty, Text | coincide; mismo testID ahora en EmptyState |
| M7 | 2 recetas exactas de contenedor en Mapa | coincide; Mapa intacto |
| M8 | 7: food, health, home, map, pairing, profile, reminders | coincide; llamadores intactos |
| M9 | 14 dobles add-pet / 1 alert-detail | coincide; todos incorporan clearPet |
| M10 | 2 satisfies SelectedPetContextValue previos en el hook | coincide; ambos incorporan clearPet |
| M11 | 0 ficheros con clearPet en src | coincide; final 2 ficheros de producción, más tests |
| M12 | 35 - 1 + 2 + 1 + 16 - 4 + 8 + 1 + 6 = 64 | coincide; final + 2 = 66 |
| M13 | 50 + 1 - 2 + 1 - 1 + 1 + 1 + 1 + 1 = 53 | coincide; final + 3 = 56 |
| M14 | 12 vacíos en texto; Perfil incluido | coincide; final 11, sin Perfil |
| M15 | 8 ficheros; reminders 1, profile ausente | coincide; final 9, reminders 2, profile 1 |
| M16 | 5 apariciones: fuente 1, tests Perfil 3, empty-state.test 1 | coincide; los 3 tests originales de Perfil no se editaron |
| M17 | 4 Excepción nombrada en conventions | n de H0 = 4; final n + 1 = 5 |
| M18 | 0 enmienda A20 en conventions | coincide; final 1 |
| M19 | 1 selectPet: en el tipo del proveedor | coincide; firma intacta |

La lista final de 9 ficheros de EmptyState se comprobó con Node sobre la
misma lista que el test compara con `.sort()`: food, alerts, docs, geofences,
health, home, map, profile, reminders (rutas completas ordenadas).
`SCREEN_FILES`, `R3_HOME` y `checkUses(ALL_USES)` se conservan.

## Commits y TDD

Los seis commits rojos se cerraron antes de escribir su implementación.
Todos fallaron por aserción, sin símbolos ausentes. R6/R7 nacieron verdes en
c10, como prescribe la excepción, y se pusieron rojos al plantar X1.
Las 13 sondas de c1 quedaron rojas; los tests negativos que ya respetaba H0
son verdes dentro del commit rojo c2, cuyo requisito sí falla sin implementar.

| Paso | Hash | Mensaje | Verificación en ese paso |
|---|---|---|---|
| c1 | `f08797a6d07fc6c8492047d4a63973bbf3cba456` | test(mobile): prueba estados sin mascotas en trece escenarios (R1) | rojo: 13 fallos por aserción (3 suites) |
| c2 | `45a13f421909fabdf85c35d942e4dbd2456d74bf` | test(mobile): verifica limpieza y escritor único de selección (R2) | rojo: 5 fallos por aserción y 8 verdes; las condiciones negativas ya se respetaban |
| c3 | `2f1165f3ba8f3e65b22443a6331322b859c4b8b7` | feat(mobile): limpia la selección cuando la lista queda vacía (R2) | verde: typecheck exit 0; 4 suites / 146 tests |
| c4 | `c5170de1fa5c4eb0987850fcd74e5d472727945d` | test(mobile): exige el vacío de Inicio fuera del scroll (R3) | rojo: 2 fallos por aserción (incluye el candado anterior enmendado) |
| c5 | `d74224cce4202d19b1985df77d80fa569e961a85` | feat(mobile): centra el estado de Inicio sin mascotas (R3) | verde: Inicio, 1 suite / 226 tests |
| c6 | `8822836986d0c43e60a7f61b231eca8a5445684e` | test(mobile): exige el vacío de cuenta en Recordatorios (R4,R8) | rojo: 9 fallos por aserción; 186 verdes |
| c7 | `f90f7d57c0232643924196a2e900959cad490895` | feat(mobile): centra la cuenta sin mascotas en Recordatorios (R4) | verde: 2 suites / 165 tests; guardas 12 suites / 327 tests |
| c8 | `c813325545c43ff1ab0a9de6d71e08183082b2a5` | test(mobile): exige el vacío ilustrado dentro de Perfil (R5,R8) | rojo: 10 fallos por aserción; 259 verdes |
| c9 | `1af399ba1d16419be18c019dd8eb578fe3bcd64b` | feat(mobile): ilustra el vacío de Perfil y oculta sus errores (R5) | verde: 2 suites / 239 tests; guardas 12 suites / 327 tests |
| c10 | `2af02ae5cc1b0b1b74fcba2a8a8f17def6862d65` | test(mobile): prueba limpieza heredada y primera mascota (R6,R7) | verde desde su creación: 3 sondas; cerradas por X1 |
| c11 | `9fe88151d7795f49e9c98ecb4597f223a9af615a` | test(mobile): exige la enmienda A20 y su firma tolerante (R9) | rojo: 2 fallos por aserción (cero apariciones y casilla ausente) |
| c12 | `78313d6a3ef0bf24d55aca8867354394f45ed4e2` | docs(mobile-no-pets-states-and-centered-content): documenta excepción A20 (R9) | verde: 2 tests de A20 |
| c13 | `6d3233181ebf033c3cbc510c9d1b3c222bc48b71` | docs(mobile-no-pets-states-and-centered-content): registra mutaciones y trazabilidad (R10) | verde: registro empírico R10 y trazabilidad; árbol restaurado, 37 tests nuevos y 329 guardas |

Recuentos reales de tests añadidos (expandiendo `it.each`, sin contar el test
anterior reescrito como uno nuevo):

| Paso | Recuento | Desglose |
|---|---|---|
| c1 | 13 | S1–S4 en tres pantallas; S5 de Perfil |
| c2, n2 | 13 | proveedor 3; hook 9 casos de comportamiento + 1 escaneo |
| c4, n3 | 1 | R3.2; el it de #155 R4 se reescribe sin aumentar el total |
| c6, n4 | 3 | contenedor/ausencias, copy/pose/acción y rama con mascota |
| c8, n5 | 2 | vacío ilustrado y centrado/cuenta; la tabla pierde 1 texto y gana 1 recuento, neto 0 |
| c10 | 3 | Comida, Salud y convergencia de Inicio |
| c11 | 2 | literal único y casilla tolerante |
| Total | 37 | todos llevan prefijo de feature y R-id |

## R10 — Mutaciones

Todas se plantaron por separado sobre el árbol verde de c12 `78313d6a3ef0bf24d55aca8867354394f45ed4e2`.
Tras cada corrida se revirtió su único archivo con
`git checkout HEAD -- <ruta>` y se comprobó
`git diff --quiet && git diff --cached --quiet` antes de la siguiente.
No sobreviven mutaciones. X5 no se plantó: es equivalente, según la enmienda
aprobada. Los fallos registrados son de aserción, sin ReferenceError ni TypeError.

| Mutación | Cambio plantado | Resultado | Commit de las sondas |
|---|---|---|---|
| X1 | quitar la llamada del hook a clearPet | 7 rojo(s); 3 verde(s) | c1 `f08797a6`; c10 `2af02ae5`; c2 `45a13f42` |
| X2 | quitar el guard isRefreshing | 1 rojo(s); 0 verde(s) | c2 `45a13f42` |
| X3 | limpiar también en kind no ok | 4 rojo(s); 0 verde(s) | c2 `45a13f42` |
| X4 | quitar selectedPetId !== null de pet-hero-error | 1 rojo(s); 0 verde(s) | c1 `f08797a6` |
| X6 | quitar selectedPetId !== null de reminders-error | 1 rojo(s); 0 verde(s) | c1 `f08797a6` |
| X7 | quitar !petsEmpty de petLoading | 1 rojo(s); 0 verde(s) | c1 `f08797a6` |
| X8 | quitar selectedPetId !== null de profile-pet-error | 1 rojo(s); 0 verde(s) | c1 `f08797a6` |
| X9 | devolver el EmptyState de Inicio al scroll, sin retorno anticipado | 2 rojo(s); 0 verde(s) | c4 `c5170de1` |
| X10 | justify-center por justify-start en Inicio | 1 rojo(s); 1 verde(s) | c4 `c5170de1` |
| X11 | restaurar Text en profile-pets-empty | 1 rojo(s); 0 verde(s) | c8 `c8133255` |
| X12 | añadir clearPet() a Inicio | 1 rojo(s); 0 verde(s) | c2 `45a13f42` |
| X5 | quitar !petsEmpty de reminders-error | equivalente, no plantada; el retorno anticipado impide observar el término | enmienda `a64859d8` |

Nombres exactos de los `it` que cayeron:

### X1

- `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento
- `src/screens/home/index.test.tsx` :: #181 R7: Inicio converge al crear la primera mascota limpia la selección rancia y selecciona la mascota que llega al revalidar la lista
- `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento
- `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S1: conserva el vacío sin tarjeta ni reintento
- `src/app/(tabs)/__tests__/food.test.tsx` :: #181 R6: food hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío
- `src/screens/health/index.test.tsx` :: #181 R6: health hereda la limpieza de selección elimina la selección rancia y conserva el estado vacío
- `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.2: limpia exactamente una vez con lista ok vacía y selección rancia

### X2

- `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia durante la revalidación

### X3

- `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind error
- `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unreachable
- `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind missing-config
- `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.3: no limpia con kind unauthorized

### X4

- `src/screens/home/index.test.tsx` :: #181 R1: home sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta

### X6

- `src/screens/reminders/index.test.tsx` :: #181 R1: reminders sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta

### X7

- `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S5: lista vacía revalidando y detalle pendiente no muestran esqueletos

### X8

- `src/screens/profile/index.test.tsx` :: #181 R1: profile sin mascotas no muestra errores de detalle S4: lista unreachable y selección nula ocultan la tarjeta

### X9

- `src/screens/home/index.test.tsx` :: #155 R4: Inicio sin mascotas presenta a Pingo queda en el sitio del vacío que sustituye (enmendado por #181 R3)
- `src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena

### X10

- `src/screens/home/index.test.tsx` :: #181 R3: Inicio centra el estado sin mascotas fuera del scroll R3.2: el contenedor centrado solo contiene home-empty y sustituye la escena

### X11

- `src/screens/profile/index.test.tsx` :: #181 R5: Perfil conserva la cuenta y compone el vacío ilustrado R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir

### X12

- `src/hooks/use-pet-selection.test.tsx` :: #181 R2: limpieza de la selección R2.4: solo proveedor y hook mencionan clearPet en producción

X1 conservó verdes estas tres sondas: `#181 R1: home… S3: conserva el vacío sin
tarjeta ni reintento`, `#181 R1: profile… S3: conserva el vacío sin tarjeta ni
reintento` y `#181 R1: reminders… S3: conserva el vacío sin tarjeta ni reintento`.
Por tanto S3 aísla las defensas de pantalla. X9 detecta también el it de
#155 R4 enmendado; con X10 ese it sigue verde y cae la prueba de clase del
contenedor R3.2.

## Verificación final

Todos los comandos se ejecutaron con `cd` absoluto a
`/home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker`.

- `test ! -e .expo/types/router.d.ts && bun run typecheck`: exit 0, antes de
  c3 y después de c12. No se borró ni generó router.d.ts.
- Lint: `bunx expo lint --no-cache > /tmp/181-lint.txt 2>&1; ! grep -qF
  'Failed to run' /tmp/181-lint.txt && test ! -s /tmp/181-lint.txt`: exit 0 al
  primer intento; archivo de salida de 0 bytes.
- Jest acotado completo de los archivos afectados: **10 suites / 837 tests,
  todos verdes**, exit 0. No es la suite completa de mobile ni del repositorio.
- Guardas `bunx jest src/__tests__`: tras c7, 12 suites / 327 tests; tras c9,
  12 / 327; tras c12 y después de revertir todas las mutaciones, **13 / 329**,
  todos verdes y exit 0. Incluye design-drift, legibility y el nuevo test A20.
- Árbol restaurado: 8 suites / **37 tests nuevos** filtrados con `-t '^#181 R'`,
  todos verdes, exit 0. Los 578 omitidos en esta corrida son el filtro de
  nombres, no una exclusión de la corrida previa de 837 tests.

Comando de los 10 ficheros concretos (rutas literales con --runTestsByPath):

```bash
cd /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker && bunx jest --runInBand --runTestsByPath src/hooks/use-pet-selection.test.tsx src/providers/__tests__/selected-pet-provider.test.tsx src/screens/home/index.test.tsx src/screens/reminders/index.test.tsx src/screens/profile/index.test.tsx 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/health/index.test.tsx src/screens/add-pet/index.test.tsx src/screens/alert-detail/index.test.tsx src/components/__tests__/empty-state.test.tsx
```

El nuevo `src/__tests__/no-pets-states.test.ts` se ejecutó en c11/c12, en las
13 suites de guardas y en la corrida final de los 37 tests nuevos. No se
ocultaron rutas con paréntesis detrás de un filtro regex.

## Skills cargadas

- `ponytail:ponytail` (full).
- `building-native-ui` (equivalente solicitado de expo-native-ui):
  `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `expo-tailwind-setup`:
  `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/expo-tailwind-setup/SKILL.md`.
- `.agents/skills/appllama-app-design-skill/SKILL.md`.

No cargadas, según el handoff: `expo-design-system`, `expo-animation`,
`expo-router`, `expo-overview`; sin sustitutos cercanos. No se llamó al MCP
Appllama. Se aplicó el patrón del EmptyState compartido y la carta del repo,
con su excepción al simulator loop: el smoke corresponde al humano.

## Entrega y límites

- No ejecutados `./init.sh`, suite completa, backend ni E2E, por prohibición
  del handoff. Sin recursos AWS ni cambios de infraestructura compartida.
- Sin cambios en `docs/ui-guidelines.md`, EmptyState compartido, catálogo i18n,
  Mapa, backend, progress/current, progress/history, STATUS ni feature_list.
- Sin PR creada o editada, sin push. Los 13 commits están en la rama indicada.
- La trazabilidad y el log empírico de mutaciones quedaron commiteados en c13.
- Este informe se entrega **sin añadir al índice**, excepción explícita del
  handoff. Así puede incluir el hash real de c13 sin crear un commit c14.
  Es el único cambio sin commit al cerrar; no hay archivos nuevos sin seguimiento.
- Única fila pendiente en la trazabilidad: smoke de Android, a ejecutar y
  firmar por humano. La casilla A20 de conventions permanece vacía tal como
  exige R9.1; su candado permite firmarla sin romper CI.

Siguiente paso del leader: gate completo en su turno y revisión independiente;
el humano ejecuta el smoke de cuenta nueva y eliminación de la única mascota.
