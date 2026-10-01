# explore: mobile-geofences (#41)

Fecha: 2026-10-01 15:46 UTC
Base: `origin/main` 3db47fb0, worktree `Pet-Tracker-wt-backend`, branch `feature/41-mobile-geofences`.
La rama de #60 se ha leído con `git show 03f57706:<ruta>`, sin tocar el worktree principal.
Skills cargadas: `expo:expo-overview` y `expo:expo-ui`. No existe skill de mapas ni de ubicación en nuestro plugin ni en el de Codex (ver Riesgos R12).

Sobre Figma: `get_design_context` (fileKey `K3GsL0HHUCW3AaFj3osx0B`, nodeId `0:1`) devuelve solo enlaces de recurso al código del Make (`App.tsx`, entre otros). Esta sesión no tiene herramienta para leer recursos MCP, así que **el diseño se ha leído a través de `progress/explore_design-gap-vs-make.md`** (2026-09-04), que se sacó de un export del Make. Ese export ya no existe en disco. Cualquier dato de diseño de abajo hereda esa fuente secundaria.

Convención del documento: **[V]** es un hecho verificado contra el árbol o el código fuente de la dependencia; **[S]** es una suposición o inferencia no probada.

---

## Contexto encontrado

### Backend (feature #11 `geofences-crud` y #12 `alerts-engine`, ambas done)

- **[V] Endpoints.** En `backend-pet-tracker/src/modules/geofences/infrastructure/geofences.controller.ts` el controlador lleva `@Controller('pets/:petId/geofences')` y `@UseGuards(PetAccessGuard, PetTrackingGuard)`:
  - `GET /` y `GET /:geofenceId` están abiertos a cualquier miembro.
  - `POST`, `PATCH /:geofenceId` y `DELETE /:geofenceId` llevan `@RequirePetRole('owner')`. El DELETE responde 204.
- **[V] DTO.** En `application/dto/create-geofence.dto.ts`:
  - Campos: `name` (trim, 1-120), `centerLat` [-90, 90], `centerLng` [-180, 180], `radiusM` [20, 2000], `active: z.boolean().optional()` y `type: z.literal('safe_circle')`. Todo es `.strict()`.
  - `UpdateGeofenceSchema = GeofenceFieldsSchema.partial().strict()`: el PATCH no admite `type`, y un body vacío es un no-op.
  - El rango del radio sale de `GEOFENCE_MIN_RADIUS_M` y `GEOFENCE_MAX_RADIUS_M` en `geofences.constants.ts`.
    > **Nota del leader (2026-10-01, verificado sobre 3db47fb0):** falso. Esas constantes no existen; `geofences.constants.ts` solo exporta `GEOFENCE_MAX_PER_PET`. El rango está literal en el DTO: `radiusM: z.number().min(20).max(2000)`. El rango 20-2000 sí es correcto.
- **[V] Límite.** `GEOFENCE_MAX_PER_PET = 5` cuenta las zonas activas e inactivas juntas. Existe una carrera conocida en el create (documentada en la spec de #11).
- **[V] Errores.** Los mapea `infrastructure/mappers/geofence-error.mapper.ts`:
  - 400 `code: 'MAX_GEOFENCES_REACHED'`
  - 409 `code: 'GEOFENCE_NAME_TAKEN'` (el nombre es único por mascota)
  - 404 `code: 'GEOFENCE_NOT_FOUND'`
  - **Hay dos formas de 400.** Un fallo de validación devuelve `{statusCode, message: 'Validation failed', errors: [{path, message}]}`, sin `code`. El límite alcanzado devuelve `code`. El cliente tiene que distinguirlas mirando `body.code`.
- **[V] Guards.**
  - `PetAccessGuard` devuelve 404 si el usuario no es miembro y 403 si su rol no encaja.
  - `PetTrackingGuard` devuelve **402 `DEVICE_SUBSCRIPTION_REQUIRED` en todos los endpoints de geocercas, GET incluido**.
  - Los roles reales son `'owner' | 'family' | 'walker' | 'vet'` (`myRole` en `mobile-pet-tracker/src/api/types.ts`).
- **[V] Respuesta.** `{id, petId, name, type: 'safe_circle', centerLat, centerLng, radiusM, active, state: {value: 'unknown'|'inside'|'outside', updatedAt: string|null}, createdAt, updatedAt}`.
- **[V] Repositorio.** `geofence.drizzle.repository.ts`:
  - Nunca escribe `geofence_state`; solo lo lee para mapearlo.
  - `delete` es un `db.delete(geofences).where(eq(geofences.id, id))` sin tratar el 23505.
  - El update fusiona la geometría con `mergedGeometry`.
- **[V] Motor de alertas.**
  - `evaluate()` en `geofence-eval.ts` está tipado solo para círculos.
  - La salida exige distancia ≥ radio × `GEOFENCE_EXIT_RADIUS_MULTIPLIER` (1.1) y precisión ≤ `GEOFENCE_EXIT_MAX_ACCURACY_M` (50 m). La entrada exige distancia ≤ radio × `GEOFENCE_ENTER_RADIUS_MULTIPLIER` (0.9). Las constantes están en `src/pipeline/constants.ts`.
  - Si el estado es `unknown`, la primera evaluación es silenciosa.
  - `listActiveGeofencesForPet` filtra `active = true`.
  - `updateGeofenceState` cambia `updatedAt` en cada evaluación.
- **[V] Antispam.** `alerts.schema.ts` define `uniqueIndex('alert_events_open_anti_spam_idx')` sobre `(petId, type, coalesce(geofenceId, nil-uuid))` con predicado `status <> 'closed'`. La migración 0008 cambió el `= 'open'` que había puesto la 0007. `alert_events.geofence_id` es `ON DELETE SET NULL`.
- **[V] Formas descartadas.** `specs/geofences-crud/design.md` §"Alternativas descartadas" rechazó los polígonos (D1):
  - la histéresis de un polígono no está definida
  - no hay editor de vértices
  - falta validar que el polígono sea simple

  `docs/brief.md` §12 lista los tipos circular, poligonal, restringida, hogar, parque, veterinaria y guardería. Solo el circular está implementado.

### Mapa móvil y expo-maps

- **[V] `PetMap` en main.**
  - `mobile-pet-tracker/src/components/pet-map.tsx` renderiza solo `GoogleMaps.View`, con props `{center, marker, polylines, colorScheme}` y `MAP_ZOOM = 16`.
  - No tiene círculos, handlers de click, ref ni prop de zoom.
  - El único consumidor es `src/screens/map/index.tsx`, y el test es `src/components/__tests__/pet-map.test.tsx`.
- **[V] `PetMap` en 03f57706 (#60).** Extrae un `mapViewProps` común y ramifica por plataforma:
  - `if (Platform.OS === 'ios') return <AppleMaps.View {...mapViewProps} … uiSettings={{ myLocationButtonEnabled: false, togglePitchEnabled: false }} />`
  - en el resto, `<GoogleMaps.View {...mapViewProps} … uiSettings={{ zoomControlsEnabled: false }} />`

  #60 también toca `app.json` (bundleIdentifier, `"deploymentTarget": "17.0"`, plugin de expo-image-picker), `app.config.ts` (associatedDomains), los tests de pet-map, `screens/map/index.test.tsx`, `screens/profile/index.tsx` (+2 líneas), add-pet, el test de hosting-artifacts y `app.config.test.ts`. **No toca el catálogo i18n.**
- **[V] Estado de #60.** `origin/feature/60-mobile-ios-support` está publicada, con veredicto del reviewer (03f57706) y **sin PR abierta**. En `feature_list.json` de main sigue pending/POSPUESTA, con un texto que dice que "ninguna sesión trabaja #60" (caducado). `progress/current.md` recoge la propuesta de Frontend: escribir #41 contra el pet-map de 03f57706, declarar #60 como dependencia y hacer el handoff solo cuando #60 esté en main. Está pendiente de decisión humana.
- **[V] expo-maps 57.0.2.**
  - Su README dice "currently in alpha… not available in Expo Go… Requires a minimum deployment target of iOS 18.0".
  - Sin embargo, el podspec declara `:ios => '16.4'` y existe `AppleMapsViewiOS17.swift` como fallback. Ese fallback pinta `circles` y emite `onMapClick`.
  - El click sobre marker, círculo o polígono es solo de iOS 18 en adelante.
- **[V] API útil para el editor.**
  - `onMapClick: (event: {coordinates}) => void` existe en las dos plataformas.
  - `onMapLongClick` es solo de Google.
  - `onCameraMove` existe en las dos, pero Android lo dispara en cada cambio de posición (LaunchedEffect) e iOS solo al terminar (`.onMapCameraChange(frequency: .onEnd)`).
  - El tipo `circles` es igual en las dos plataformas: `{id?, center, radius (metros), color?, lineColor?, lineWidth?}`.
  - **No hay eventos de arrastre de marker.**
- **[V] La cámara no es solo la posición inicial.**
  - En Android, `GoogleMapsView.kt` `updateCameraState()` hace `remember(props.cameraPosition.value) { CameraPositionState(...) }`. `CameraPositionRecord` y `Coordinates` son `data class` de Kotlin, que comparan por valor.
  - En iOS, `.onChange(of: props.cameraPosition)` hace lo mismo.
  - Consecuencia: **la cámara se reaplica cada vez que cambia el valor de las coordenadas o del zoom**. Esto contradice `specs/android-map-never-ready/design.md`, que dice que cameraPosition es la "posición inicial de cámara" y confía en `key={selectedPetId}` y el remontaje.
- **[V] Permisos.**
  - `app.json` no declara el plugin de expo-maps ni permisos de ubicación.
  - `withMapsLocation` de expo-maps solo añade permisos si se le pasa `requestLocationPermission`.
  - `expo-location` no está instalado.
  - Las geocercas no necesitan la ubicación del usuario: el centro se elige tocando el mapa o se toma de la última posición de la mascota.
- **[V] Jest.** El preset de jest-expo corre con `Platform.OS === 'ios'` (D5 de `specs/android-map-never-ready/design.md`). expo-maps se mockea por fichero dentro de los tests de pet-map y de la pantalla de mapa.

### Diseño (Make, vía `progress/explore_design-gap-vs-make.md`)

- **§1.11 `GeofencesScreen`** (`App.tsx:1314-1410` en el export) está marcada "NO EXISTE" en la app. Tiene estos bloques:
  - un mapa con las zonas dibujadas y el pin de la mascota
  - una píldora "<nombre> · En zona segura"
  - un botón "+ Nueva zona"
  - una lista de zonas con icono, nombre y radio
  - un **toggle de activa**
  - un **slider de radio de 50 a 500 m**
  - botones Editar y Eliminar
- **§1.2**: la pestaña Mapa del Make dibuja un círculo de geocerca con "✓ Zona Segura".
- **§1.5**: el Perfil tiene una fila "Geocercas configuradas".
- **§1.14**: GpsConfig tiene una sección "Geocercas".
- **Decisión F** del gap doc: el Make sugiere una zona compartida entre varias mascotas, pero el modelo es una mascota por zona (`pet_id` NOT NULL, unicidad `(pet_id, name)`).
- El Make no dibuja el estado 402. `docs/ui-guidelines.md` advierte justo eso: "no dibuja estados que existen de verdad, como el 402".

### Navegación y patrones móviles

- **[V] Rutas.**
  - Convención: ruta delgada más pantalla en `src/screens/`.
  - El precedente por mascota es `src/app/pets/[petId]/docs.tsx`: `useLocalSearchParams<{petId}>` y `<DocsScreen petId={petId}/>`.
  - `src/app/_layout.tsx` `RootStack` tiene `Stack.Protected` con 9 hijos, todos con `headerOptions`: add-reminder, pets/add, pets/[petId]/docs, weight-log, meal-schedule, pairing, reminders, alerts y alerts/[alertId].
- **[V] Candados de rutas.**
  - `src/app/__tests__/layout.test.tsx` asevera `expect(children).toHaveLength(8 + 1); // #100 R2` y `expect(children).toHaveLength(9);`.
  - `src/app/__tests__/detail-stack.test.tsx` enumera las rutas raíz y comprueba que "(tabs) conserva solo las cinco pestañas".
- **[V] Entrada desde el Perfil.** `src/screens/profile/index.tsx` tiene las filas de acceso `documents-link` (`router.push(\`/pets/${pet.id}/docs\` as Href)`), `pairing-link` y `reminders-link`. Cada una es un Pressable con `rounded-xl bg-default px-3 py-2`, `CONTINUOUS_CORNER` y `ChevronRight`. El Make añade una cuarta fila, "Geocercas configuradas".
- **[V] Datos.**
  - `src/api/query-keys.ts` tiene un objeto de claves por dominio (`petKeys`, `alertKeys`, `deviceKeys`…) y no tiene `geofenceKeys`.
  - **No hay `useMutation` en producción.** Las mutaciones siguen el patrón llamada async manual, `switch (result.kind)` y `query.refetch()`. El `handleSubmit` de weight-log es el precedente más cercano.
  - El 402 se traduce a `{ kind: 'no-tracking' }` en `src/api/positions.ts` y `src/api/activity.ts`.
  - Los errores se discriminan por `body.code` en `src/api/devices.ts` (`isRecord`). `nutrition.ts` tiene un helper duplicado, `isObjectBody`.
- **[V] HTTP.** `src/api/http.ts` solo exporta `getJson`, `postJson(baseUrl, path, token, body, fetchFn)` y `deleteJson(…, body?)`. **No hay PATCH** (media.ts hace un PUT crudo) y no hay `http.test.ts`.
- **[V] Roles en la UI.** `src/screens/map/index.tsx` ya restringe a owner con `const canSetLostMode = selectedPet?.myRole === 'owner';`, que es el precedente de UI de solo-owner.
- **[V] Confirmación destructiva.** El `confirmRelease` de pairing usa `Alert.alert(title, body, [{cancel}, {style: 'destructive', onPress}])`.
- **[V] Controles disponibles.**
  - heroui-native 1.0.8 trae `slider` (`value`, `onChange`, `onChangeEnd`, `minValue`, `maxValue`, `step`) y `switch`. Ninguno se usa todavía en el repo.
  - `@expo/ui/community/slider` (solo `onValueChange`) existe y tampoco se usa.
  - La regla 5 de `docs/ui-guidelines.md` manda probar heroui-native primero y luego `@expo/ui/community/*`.
- **[V] Tokens.**
  - `src/theme/global.css` ya tiene tokens translúcidos (`--color-tab-pill: rgba(23,130,85,0.14)`, dark 0.22).
  - `src/theme/__tests__/global-css.test.ts` bloquea los tokens uno a uno.
  - Los colores del mapa se pasan de forma imperativa con `useThemeColors([...])` (regla 9).
- **[V] i18n.**
  - `src/i18n/catalog.ts` tiene claves planas en `en` y `es`. `'alerts.typeGeofenceExit'` ya existe.
  - El candado está en `src/providers/__tests__/language-provider.test.tsx`: `expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3)`, más la paridad de marcadores entre idiomas.
  - Cada grupo de copy nuevo exige tres cosas: una tabla en `src/__tests__/ui-copy-table.ts`, un describe en `ui-language.test.ts` y un registro en `specs/mobile-ui-language/design.md`. El precedente es `R13_ALERT_DETAIL` de #100.
- **[V] Tipos del router.** `.expo/types/router.d.ts` no existe en este worktree (está gitignorado). `typedRoutes: true` sigue activo y las rutas se castean con `as Href`.

---

## Premisas falsas o caducadas

1. **`files_affected: src/app/geofences/`** contradice la convención de ruta delgada más `src/screens/`. Lo coherente con `pets/[petId]/docs` es `src/app/pets/[petId]/geofences.tsx` más `src/screens/geofences/`.
2. **"Dibujo/edición de zonas en el mapa"**: solo se pueden dibujar círculos. El backend acepta únicamente `type: 'safe_circle'`, y los polígonos se descartaron en #11 (D1).
3. **"Reutilizar el mapa de #36"**: `PetMap` no tiene círculos, clicks, zoom ni ref. Habría que ampliarlo.
4. **El slider de 50 a 500 m del Make** no coincide con el rango del backend, que es de 20 a 2000 m.
5. **"owner/viewer"**: los roles reales son owner, family, walker y vet. Solo owner puede escribir; todos pueden leer.
6. **Mover el centro arrastrando el pin no es viable**: expo-maps no tiene eventos de drag.
7. **"cameraPosition es inicial"** (`specs/android-map-never-ready/design.md`) es falso: la cámara se reaplica cuando cambian los valores. Para #41 importa, porque si la cámara se ata al centro del círculo, cada toque recentra el mapa.
8. **`docs/data-model.md` está caducado**: todavía dice que el índice antispam usa `WHERE status='open'`, cuando el real es `status <> 'closed'` desde la 0008.
9. **#60 en `feature_list.json`**: "ninguna sesión trabaja #60" está caducado. La rama existe y tiene veredicto.
10. **iOS y expo-maps**: el README pide iOS 18, mientras que #60 fija `deploymentTarget` 17.0. El código cae a un fallback en iOS 17 que conserva `circles` y `onMapClick`, pero pierde el click sobre marker y círculo. [S] No se ha probado en un dispositivo.
11. **No hay `useMutation` ni helper PATCH**. Cualquier spec que los dé por hechos es falsa.

---

## Riesgos y ambigüedades

- **R1. Solape con #60.**
  - `pet-map.tsx`, su test y `screens/map/index.test.tsx` los toca #60, y #41 tendría que ampliar los mismos ficheros. `screens/profile/index.tsx` también lo tocan las dos (fila nueva).
  - Si #41 se escribe contra main, chocará al mergear #60, y la memoria "reparto de ficheros caduca al mergear" ya avisa de eso.
  - Las salidas posibles son esperar a que #60 esté en main o escribir #41 contra el `mapViewProps` de 03f57706 y no hacer el handoff hasta el merge.
- **R2. Candado del Stack.** Una ruta nueva `pets/[petId]/geofences` (y una de editor, si se separa) obliga a actualizar los dos `toHaveLength` de `layout.test.tsx` y la enumeración de `detail-stack.test.tsx`. Los recuentos se desplazan; la spec debe anclar por contenido.
- **R3. Candado del catálogo.** Las claves nuevas obligan a ajustar el `toHaveLength(260 + …)` de `language-provider.test.tsx`, la tabla en `ui-copy-table.ts`, el describe en `ui-language.test.ts` y el registro en `specs/mobile-ui-language/design.md`. La memoria "candado de catálogo omitido" dice que esto ya paró el trabajo dos veces.
- **R4. Tokens.** Si el relleno del círculo usa un token nuevo (por ejemplo `--color-geofence-fill`), hay que actualizar `global-css.test.ts`. La alternativa es reutilizar `tab-pill` o un color derivado vía `useThemeColors`.
- **R5. Cámara reaplicada por valor (ver Premisa 7).** El editor debe desacoplar la cámara del centro del círculo: fijarla al abrir y cambiarla solo cuando el radio cambie el zoom necesario.
  - Con `MAP_ZOOM` 16, un ancho de unos 400 dp muestra unos 900 m. Un radio de 2000 m necesita zoom ≈ 13,8.
  - Conviene un helper puro `zoomForRadius` en `src/utils/` con tabla de casos.
- **R6. `onCameraMove`** dispara con frecuencias distintas en Android e iOS. No conviene apoyar lógica en él. Si hace falta, usar debounce o ignorarlo.
- **R7. Gestos.** Un mapa dentro de un `ScrollView` provoca conflicto de gestos (el pan del mapa contra el scroll). Además, la regla 10 prohíbe un `bg-*` opaco por encima de la vista nativa del mapa. [S] La distribución mapa fijo arriba más lista debajo evita el problema, igual que la pantalla de mapa actual.
- **R8. Jest corre como iOS.** Si #60 está en main, los tests pintarán `AppleMaps.View` por defecto. Las aserciones sobre las props de `GoogleMaps.View` exigen `Platform.OS = 'android'` explícito, y hay que replicar el patrón de D5.
- **R9. `.expo/types/router.d.ts`.** Ahora no existe, pero si aparece con rutas fantasma rompe el typecheck. En el handoff a Codex hay que usar `test ! -e`, no `rm -f`.
- **R10. Flakiness del mapa en jest.** expo-maps va mockeado por fichero. Los mocks no pueden copiarse literalmente de otra suite (memoria "mocks prescritos literalmente"): hay que prescribir la intención y que la spec diga qué props del mock lee cada R-id. [S] No se ha visto flake específico de pet-map en las corridas registradas.
- **R11. Codex sin skill de mapas.** Ninguno de los dos plugins tiene una skill de mapas o ubicación. Toda la guía sobre expo-maps (circles, onMapClick, cámara por valor, la falta de drag) tiene que quedar escrita en la spec. En el handoff se nombran `building-native-ui` y `native-data-fetching` (nombres de Codex).
- **R12. Agujeros del backend** (inferidos de la lectura; ninguno tiene test que los cubra):
  1. **[V lectura] Un PATCH que cambia la geometría no resetea `geofence_state`.** Si se mueve o encoge la zona, la siguiente posición puede dar una alerta de salida espuria. Si se agranda, puede cerrar una alerta abierta con un "regresó" espurio.
  2. **[V lectura] `active: false` no cierra la alerta abierta** de esa zona. Queda abierta hasta que alguien la cierre a mano.
  3. **[S] DELETE de una segunda zona con alerta de salida no cerrada en la misma mascota.** El `SET NULL` convierte las dos en `(pet, 'geofence_exit', nil)`. Si ya hay otra no cerrada con `geofence_id` nulo, colisiona con el índice antispam: 23505 sin mapear y probable 500. No hay e2e que borre una zona con alerta abierta o con ack.
  4. **[V lectura] Las alertas huérfanas** (`geofence_id` nulo tras el DELETE) no se cierran nunca, porque `closeOpenAlert` busca por `geofenceId` y la zona ya no se evalúa.
  5. **[V] `updatedAt`** cambia en cada evaluación, así que no sirve para concurrencia optimista ni para mostrar "editado hace X".
  6. **[V] 402 en GET**: una mascota sin collar ni suscripción no puede ver ni crear zonas por adelantado.

  El 1 y el 2 afectan a lo que el usuario ve justo después de editar o desactivar desde la app. Por eso #41 los hace visibles, aunque no los cree.
- **R13. Carrera del límite de 5.** Dos POST concurrentes pueden dejar 6 zonas. En móvil se dispara poco (solo hay un owner), pero la UI no debe confiar en contar en cliente: tiene que manejar el `MAX_GEOFENCES_REACHED`.

---

## Decisiones abiertas para el humano

Cada decisión lleva sus opciones y una recomendación. La recomendación no es la decisión.

1. **Forma.**
   - (a) Solo círculo, que es lo que soporta el backend.
   - (b) Polígono, que exige reabrir #11, definir la histéresis, construir un editor de vértices y validar el polígono.
   - **Recomendación: (a).**
2. **UX de dibujo.**
   - (a) Tocar el mapa (`onMapClick`) fija el centro y un slider fija el radio, con previsualización en vivo del círculo.
   - (b) Centro fijo en la última posición de la mascota y solo el slider.
   - (c) Long-press, que es solo Android y no sirve.
   - **Recomendación: (a), con valor por defecto (b)**: el centro inicial es la última posición conocida, o el centro del mapa si no hay ninguna. Para el slider, heroui `Slider` con `onChangeEnd` (regla 5).
3. **Punto de entrada.**
   - (a) Fila "Geocercas" en el Perfil, junto a documentos, emparejamiento y recordatorios.
   - (b) Botón en la pestaña Mapa.
   - (c) Ambos.
   - **Recomendación: (a)**, que coincide con el Make §1.5 y con el precedente de docs. Lo de (b) puede ir en otra feature.
4. **Límites y rango del slider.**
   - (a) Igual que el backend: de 20 a 2000 m.
   - (b) Igual que el Make: de 50 a 500 m.
   - (c) De 20 a 2000 m con una escala no lineal o pasos variables.
   - **Recomendación: (a), con `step` de 10 m.** Con la opción (b), las zonas creadas por API fuera de rango quedarían fuera del slider. El límite de 5 se muestra a partir del error del servidor, no contando en cliente.
5. **Quién edita.**
   - (a) Solo owner, en espejo del backend. El resto ve la lista en solo lectura.
   - (b) Ocultar la pantalla a quien no sea owner.
   - **Recomendación: (a)**, con `myRole === 'owner'` como en el precedente de `canSetLostMode`.
6. **Activar y desactivar.**
   - (a) Switch en cada fila que hace `PATCH {active}` en el momento.
   - (b) Solo dentro del editor.
   - **Recomendación: (a)**, con heroui `Switch`. Antes de decidir conviene tener en cuenta el agujero R12.2.
7. **Paridad iOS con #60.**
   - (a) Escribir #41 contra 03f57706, declarar `depends_on: [60]` y hacer el handoff tras el merge.
   - (b) Escribirla contra main, solo Android, y adaptar después.
   - (c) Mergear #60 antes de escribir la spec.
   - **Recomendación: (c) o (a).** La (b) garantiza un conflicto sobre pet-map. Hay que decidir también si el smoke de iOS entra en #41 o se difiere, porque #60 tiene sus propios gates humanos de iOS pendientes.
8. **Gate de smoke.** Se hace en un dev build de Android (expo-maps no está en Expo Go) y debe cubrir:
   - crear tocando el mapa
   - cambiar el radio y ver el círculo
   - toggle
   - borrar con confirmación
   - una cuenta no-owner en solo lectura
   - el 402 con una mascota sin collar

   **Recomendación**: añadir una caminata real fuera de la zona para ver la alerta de extremo a extremo, como gate opcional del humano, porque depende de que haya collar real o simulador de posiciones.
9. **Decisión F: zona compartida entre varias mascotas.**
   - (a) Una zona por mascota, que es el modelo actual.
   - (b) Zonas compartidas, que obligan a cambiar el modelo.
   - **Recomendación: (a).**
10. **Círculos en la pestaña Mapa** (Make §1.2).
    - (a) Fuera de #41.
    - (b) Dentro.
    - **Recomendación: (a)**: evita el solape con `screens/map/index.test.tsx` de #60 y puede ir en una feature pequeña después.
11. **Mascota sin collar (402).**
    - (a) Mostrar el estado "sin seguimiento" con el mismo patrón que `{kind: 'no-tracking'}`.
    - (b) Cambiar el backend para permitir GET y POST sin suscripción.
    - **Recomendación: (a)** en #41. La (b) es una decisión de producto aparte.
12. **Endurecimiento del backend** (R12.1 a R12.4).
    - (a) Una feature backend previa o paralela: resetear el estado al cambiar la geometría, cerrar la alerta al desactivar o borrar, y arreglar la colisión del DELETE.
    - (b) Registrarlos como deuda y seguir.
    - **Recomendación: (a) como feature separada**, con un e2e que reproduzca el 23505 del DELETE antes de arreglarlo (R12.3 es inferido). No debe bloquear la parte de lista de #41, pero sí conviene que vaya antes que el editor.

---

## Alcance y partición propuesta

- **(A) Backend, opcional y separada:** el endurecimiento de R12.1 a R12.4, más corregir `docs/data-model.md` (predicado antispam). Va solo en `backend-pet-tracker/` y no solapa con el móvil.
- **(B) Móvil, lista** (cuerpo de #41, primera mitad):
  - `src/api/geofences.ts` con list, create, patch y delete
  - un helper `patchJson` en `http.ts`, o un parámetro de método en el helper existente
  - `geofenceKeys` en `query-keys.ts`
  - la ruta `src/app/pets/[petId]/geofences.tsx` y la pantalla `src/screens/geofences/`, con la lista, el switch de activa, el borrado con `Alert.alert` destructivo, los estados 402, vacío y error, y la solo-lectura para no-owner
  - la fila en el Perfil
  - los candados de layout, detail-stack y catálogo
- **(C) Móvil, editor sobre mapa** (segunda mitad, o una feature hija si (B) sale grande):
  - extender `PetMap` con props opcionales `circles`, `onMapClick` y zoom, sin romper los consumidores actuales
  - el helper puro de zoom por radio
  - el formulario con nombre y slider
  - los errores 409 y 400 `MAX_GEOFENCES_REACHED`
  - [S] el editor como ruta propia (`pets/[petId]/geofences/[geofenceId]` y `/new`) o como sheet. Una ruta añade un hijo al Stack (R2); un sheet evita ese candado, pero mete un mapa dentro de un sheet (riesgo de gestos, R7).

Si se parte, (B) y (C) pueden ser una sola feature con dos bloques de R-ids o dos ids. Los ids nuevos tienen que comprobarse contra `origin/main` (el máximo actual es 144).

## Recomendación

- Solo círculo.
- Entrada desde el Perfil y ruta por mascota con pantalla en `src/screens/geofences/`.
- Tocar el mapa fija el centro y un heroui `Slider` fija el radio de 20 a 2000 m, con previsualización del círculo en `PetMap` ampliado. La cámara va desacoplada del centro, con zoom derivado del radio por un helper puro con test.
- Mutaciones solo para owner, con el patrón manual async, `switch (result.kind)` y `refetch` (sin introducir `useMutation`).
- Errores discriminados por status y `body.code`: 402 es sin seguimiento, 409 es nombre usado, 400 con `MAX_GEOFENCES_REACHED` es el límite y 400 sin código es validación.
- Escribir la spec contra el pet-map de 03f57706 y no hacer el handoff hasta que #60 esté en main, o mergear #60 primero.
- Dejar los círculos de la pestaña Mapa fuera de #41.
- Abrir aparte la feature backend de endurecimiento.
- Toda la guía de expo-maps tiene que ir en la spec, porque Codex no tiene una skill de mapas.

**Dependencias nuevas: ninguna.** expo-maps, heroui-native (Slider y Switch) y `@expo/ui` ya están instalados. No hace falta `expo-location`.
