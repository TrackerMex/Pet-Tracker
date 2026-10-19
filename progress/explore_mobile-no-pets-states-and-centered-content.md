# explore: mobile-no-pets-states-and-centered-content
Fecha: 2026-10-16
Base: origin/main 44acd74b (#173, #178, #179 ya mergeadas). Solo lectura; no se corrió init.sh ni jest.
Citas por fichero + símbolo grepable (sin números de línea). Rutas relativas a `mobile-pet-tracker/` salvo indicación.

## 1. Hallazgos verificados

### 1.1 Causa del «Algo salió mal» + «Reintentar» (parte 1 de #181)

Hipótesis de lectura de código, NO reproducida en dispositivo ni con una sonda de test.

**Premisa clave: con una sesión recién iniciada de una cuenta sin mascotas, el código predice que la tarjeta NO aparece.**
- `src/providers/selected-pet-provider.tsx`: la selección va clavada al token (`selection.token !== token` la pone a `null`). Sesión nueva => `selectedPetId === null`.
- Home, Perfil y Recordatorios habilitan sus consultas por mascota con `enabled: selectedPetId !== null` (`detail` en home y profile, `reminders` en reminders, además `activity` en home). Con `null` esas consultas no se lanzan, `detail.data` y `reminders.data` quedan `undefined` y ningún bloque de error renderiza.
- `GET /pets` sin membresías devuelve 200 `[]` (`backend-pet-tracker/.../list-pets.use-case.ts`, `test/pets.e2e-spec.ts` espera `[]`). En móvil `listPets` (`src/api/pets.ts`) lo mapea a `{ kind: 'ok', pets: [] }`. No es un error de la lista.

**Camino que sí produce la tarjeta: selección rancia.** `selectedPetId` apunta a una mascota que ya no es accesible mientras la lista llega vacía:
1. `src/hooks/use-pet-selection.ts` (`usePetSelection`) sale temprano con `pets.data.pets.length === 0` y nunca limpia la selección: solo llama `selectPet(pets.data.pets[0].id)` cuando hay mascotas y la selección no está en la lista. `SelectedPetContextValue` no ofrece `clearPet`; `selectPet(id: string)` no admite `null`.
2. Con la selección rancia, `GET /pets/:id` responde 404 (`PetAccessGuard`: sin membresía activa => 404). `getPet` (`src/api/pets.ts`) mapea todo no-200 a `{ kind: 'error' }`.
3. Home: `home-content` pinta siempre `pet-hero-error` (`HeroUICard`, `common.somethingWentWrong`, `pet-hero-retry`) cuando `detail.data?.kind` es `error` o `unreachable`. Se muestra A LA VEZ que `home-empty` de `home-states` (el estado vacío sí está, pero la tarjeta lo acompaña).
4. Recordatorios: `listReminders` (`src/api/reminders.ts`) mapea 404 a `not-found`; `isRemindersError` en `src/screens/reminders/index.tsx` lo incluye y pinta `reminders-error` (`common.somethingWentWrong`) + `reminders-retry`. Esta pantalla NO tiene rama sin mascotas.
5. Perfil: pinta `profile-pets-empty` (`common.noPetsYet`) Y TAMBIÉN `profile-pet-error` (Card, `profile.couldNotLoadPet` + `profile-pet-retry`) por el `detail` rancio.

**Cómo puede quedar rancia la selección** (a verificar con el humano; ninguna es posible solo con el flujo móvil actual):
- No hay UI móvil para borrar una mascota (no hay `deletePet` en `src/api`; `deleteJson` en `src/api/http.ts` lo usan geofences, push tokens, devices, etc.). El backend sí tiene `DELETE /pets/:petId`.
- Casos plausibles: BD de desarrollo reseteada/limpiada con el JWT aún válido, mascota borrada por API/otra sesión, o membresía revocada, todo dentro de la misma sesión (el token no cambia, la selección no se resetea).
- Es el escenario típico de un smoke manual en el VPS, coherente con que el humano lo viera al firmar R16 de #171. Hay que preguntarle cómo llegó a la cuenta sin mascotas (¿borró mascotas con la sesión abierta?).

**Premisa del feature_list.json parcialmente falsa:** el texto literal dice que Perfil muestra «Algo salió mal». Perfil usa otro copy (`profile.couldNotLoadPet`: «No se pudo cargar el perfil de la mascota»). Solo Inicio y Recordatorios usan `common.somethingWentWrong`.

**Estado que debe verse y si ya existe:**
- Inicio: `home-empty` (`EmptyState`, `common.noPetsYet`/`common.noPetsBody`, acción `profile.addPet` => `/pets/add`) YA existe. Falta suprimir `pet-hero-error`.
- Perfil: `profile-pets-empty` (Text plano) YA existe, sin Pingo ni acción. Falta suprimir `profile-pet-error`. Decisión de diseño abierta (D3).
- Recordatorios: NO existe estado sin mascotas. Hay que crearlo (copy `common.noPetsYet` + `common.noPetsBody` ya en catálogo; la acción es decisión de la spec).
- Referencia ya correcta: Mapa (`map-no-pets`) y Salud (`health-empty`) filtran por lista (`petsReady = pets.data?.kind==='ok' && pets.data.pets.length>0` en `src/screens/map/index.tsx`) y por eso NO muestran el error aunque la selección esté rancia. Comida tiene `food-empty` pero `food-plan-error` aparece con selección rancia (ver inventario).

### 1.2 Qué hace que Mapa esté «centrado» (parte 2 de #181)

Medido en `src/screens/map/index.tsx`:
- Raíz `View testID="screen-map" className="flex-1"`.
- Cada estado (`map-error`, `map-no-pets`, `map-no-tracking`, `map-last-error-state`) va en un contenedor `flex-1 items-center justify-center p-6 bg-background`: centrado en AMBOS ejes dentro del área disponible, padding 24, sin `maxWidth`, sin `insets` (la pantalla es tab con `headerShown: false` y el contenedor no compensa el status bar; ver riesgo R3).
- Con mascota, el mapa llena la pantalla (no hay contenido centrado, es un mapa nativo).
- Sin `maxWidth`, sin `alignSelf`, sin token de ancho propio.
- Por tanto «centrado como Mapa» solo está definido para ESTADOS (vacío/error/sin collar), no para contenido con scroll.

Resto de pantallas (medido en #173/#178/#179 ya mergeadas): son `ScrollView`/`View` anclados arriba con `contentContainerStyle` candado: Home `padding 24`/`paddingTop insets.top+12` en `home-states`; Perfil `padding:20, gap:14, paddingTop: insets.top+12, paddingBottom: insets.bottom+96`; Recordatorios `paddingHorizontal:20, paddingTop:24, gap:14, paddingBottom: insets.bottom+24`; Salud/Comida con su propio candado. Ninguna centra verticalmente; ninguna fija `maxWidth`.

Reglas existentes (verificadas):
- `docs/conventions.md` §Dimensiones de pantalla uniformes y `docs/ui-guidelines.md` regla 6: definen padding horizontal y márgenes, con excepciones nombradas (A9, A11, la de fidelidad al canvas de 20 px del 2026-10-13). No hay NINGUNA regla de centrado, de ancho máximo ni de alineación vertical de estados. Cualquier regla nueva es enmienda de carta.
- `EmptyState` (`src/components/empty-state.tsx`): `items-center gap-3 py-8`, Pingo 160 px, botón `rounded-xl bg-accent border-b-4 border-black/25`. #176 (composición centrada del vacío de Inicio, Pingo 190 px, CTA ancho completo) y #177 (receta global de botones) están pendientes y lo cambian. `EmptyState` lo comparten ocho pantallas.

## 2. Premisas del feature_list.json falsas o no verificadas

| Premisa | Estado |
|---|---|
| «Con una cuenta sin mascotas, Inicio, Perfil y Recordatorios muestran Algo salió mal + Reintentar» | PARCIAL. Solo con selección rancia. Sesión nueva sin mascotas: el código predice que no aparece. No reproducida. Perfil usa copy distinto. |
| «La causa no está verificada» | Resuelto en lectura: selección rancia + `usePetSelection` que no limpia. Falta confirmar con sonda roja y con el humano el camino real. |
| «#173 (aprobada, sin mergear) reescribe profile, pet-switcher y card» | OBSOLETA: #173, #178, #179 ya mergeadas en 44acd74b. |
| «#178 reescribe reminders y su test (marco, padding y vacío con EmptyState y acción reminders.new)» | MERGEADA. Verificado: el marco de reminders (`paddingHorizontal:20, paddingTop:24, gap:14`) está candado; el vacío con EmptyState es solo para lista ok vacía (`reminders-empty`), no para sin mascotas. |
| «#176 trae la composición centrada del vacío de Inicio (fila 16)» | Cierto en el texto de #176, que además dice «#181 centra el contenido de todas las pantallas, incluida la fila 16»: **referencia circular** entre #176 y #181 sobre quién centra el vacío de Inicio. Hay que decidir dueño (D4). |
| «El contenido de todas las pantallas debe quedar centrado como Mapa» | NO medible tal cual: Mapa solo centra estados. Interpretación sin confirmar (D1). |
| #188-#192 | No existen en feature_list.json de esta base (máximo id 187). Registradas en la branch `chore/register-188-192-canvas-parity` (aún sin mergear). #190 dice «va tras #176 y #181 (mismo screen)». |

## 3. Inventario de pantallas

Fuente: `src/screens/*` y `src/app/*`. «Selección rancia» = `selectedPetId` no nulo con lista vacía.

| Pantalla | Rama sin mascotas | Con selección rancia |
|---|---|---|
| home (`screens/home`) | `home-empty` (EmptyState, `common.noPetsYet`/`common.noPetsBody`) | `pet-hero-error` (`common.somethingWentWrong` + `pet-hero-retry`) junto a `home-empty`. BUG |
| profile (`screens/profile`) | `profile-pets-empty` (Text, `common.noPetsYet`) | `profile-pet-error` (`profile.couldNotLoadPet` + `profile-pet-retry`). BUG, copy distinto |
| reminders (`screens/reminders`) | NINGUNA | `reminders-error` (`common.somethingWentWrong` + `reminders-retry`). BUG |
| map (`screens/map`) | `map-no-pets` (centrado) | sin error: gateado por la lista. OK |
| health (`screens/health`) | `health-empty` (+ `health-states`) | gateado por la lista. OK |
| food (`app/(tabs)/food.tsx`) | `food-empty` | `food-plan-error` (`food.couldNotLoadPlan`) y `food-plan-empty`. Mismo defecto, menor |
| weight-log | Redirect a `/health` si `selectedPetId === null` | `weight-log-error`. Mismo defecto |
| meals-history | Redirect a `/food` si null | `meals-history-error` (incluye `not-found`). Mismo defecto |
| meal-schedule | Redirect a `/food` si null | `meal-schedule-error`. Mismo defecto |
| add-reminder | `router.dismissTo('/reminders')` si null | error similar. Mismo defecto |
| pairing | `pairing-no-pets` (Text, `pairing.addPetFirst`), `pairing-error-pets` | no depende de la selección. OK |
| alerts, docs, geofences, geofence-editor, alert-detail | no dependen de `selectedPetId` (`alerts-empty`, `docs-empty`, `geofences-empty`; `geofences-no-tracking` es sin collar) | n/a |

Fuera de las tres que nombra el humano, Comida y las pantallas de detalle (weight-log, meals-history, meal-schedule, add-reminder) comparten la causa raíz, pero solo son alcanzables desde una pantalla ya rota, o con selección rancia al entrar directo.

## 4. Solapes y candados que #181 tocaría

- **`usePetSelection` / `SelectedPetProvider`**: `src/hooks/use-pet-selection.test.tsx` no tiene caso de lista vacía con selección rancia (hueco de cobertura; es el candado que falta). Cambiar la API del provider (añadir `clearPet` / admitir `null`) toca los dobles que mockean `useSelectedPet` en los tests de pantallas (grep antes de especificar). Historial: `f13d945b fix(mobile-tanstack-query): restore stale selection guard (R20)` restauró la guarda de `usePetSelection`; el spec de #20-era es `specs/mobile-tanstack-query`. Leer su R de selección antes de enmendar.
- **Home**: `src/screens/home/index.test.tsx` candada el estilo de `home-states`, el `contentContainerStyle` de `screen-home` y el orden de hijos `['Text','home-empty']`. Cualquier centrado de `home-empty` mueve esos candados. Propiedad compartida con #176 (vacío de Inicio) y #190 (burbuja de Pingo en Inicio, «tras #176 y #181»).
- **Reminders**: `src/screens/reminders/index.test.tsx` candada `contentContainerStyle`. Una rama sin mascotas nueva exige ahora una fila en `src/__tests__/ui-copy-table.ts` si usa `t()` (la tabla es lista ordenada de usos por fichero: en reminders hay tres filas consecutivas de `common.somethingWentWrong`) y el recuento de `checkUses(ALL_USES)` en `src/__tests__/ui-language.test.ts` (`SCREEN_FILES` tiene un recuento sumado a mano: no cambia si no se añade pantalla).
- **Perfil**: #184 (pendiente) candada `profile-sign-out`, `change-photo`, `PetSwitcher` y el flake de `me-card` en `src/screens/profile/index.test.tsx`; #181 y #184 tocan el mismo fichero y test (conflicto de merge probable, sin dependencia lógica).
- **EmptyState**: #176 (composición/190 px) y #177 (receta global de botón) lo reescriben. Si #181 pone `EmptyState` en Recordatorios/Perfil, hereda lo que decidan ellas. Orden recomendado en D4.
- **Design-drift** (`src/__tests__/design-drift.test.ts` y guards `legibility-classnames`): una rama centrada nueva con clases de color (`text-accent` suelto lo prohíbe #61 R4) o un literal `#NNN` en comentarios los dispara. Ver memoria «Guards de carta en specs de clases».
- **Candados de `contentContainerStyle` en ~20 tests de pantalla**: cualquier regla global de ancho máximo/centrado de contenido con scroll los rompe todos a la vez (D1, opción B).
- **#188, #189, #191, #192**: tocan pairing, geofences, add-pet, map. Solo #189/#191/#192 pueden interferir con un centrado global; #192 toca Mapa (la referencia).

## 5. Decisiones abiertas para el humano

**D1. ¿Qué significa «centrado como Mapa»?**
- A. Solo ESTADOS (vacío, error, sin collar, sin mascotas) centrados en ambos ejes como `map-no-pets` (`flex-1 items-center justify-center p-6`). Contenido con scroll intacto.
- B. Contenido de todas las pantallas con ancho máximo y centrado horizontal (relevante en pantallas anchas/tablet). Rompe ~20 candados de `contentContainerStyle`; no hay token ni regla.
- C. A para estados + B solo si el humano lo pide con una captura.
- Recomendación: A. Es lo único que Mapa realmente tiene, es barato y no choca con los candados de scroll. Pedir al humano una captura o confirmación de qué pantalla ve descentrada antes de B.

**D2. Cómo corregir la causa raíz.**
- A. En `usePetSelection`, limpiar la selección cuando la lista llega `ok` y vacía (requiere ampliar el provider con `clearPet`/`selectPet(null)`). Arregla las ~9 pantallas de una vez.
- B. Gatear cada pantalla por la lista, como ya hacen Mapa y Salud (`petsReady`). No toca el provider; repite el patrón en Home, Perfil, Recordatorios y Comida.
- C. Tratar `not-found` de `getPet` como «sin mascota» en vez de `error`.
- Recomendación: A, con B como red de seguridad en Home/Perfil/Recordatorios. A cierra la clase de defecto y la sonda roja es un test de hook. Documentar que el cambio de API del provider toca los dobles de tests de pantalla.

**D3. Qué muestran Perfil y Recordatorios sin mascotas.**
- A. `EmptyState` (Pingo, `common.noPetsYet`/`common.noPetsBody`, acción `profile.addPet` => `/pets/add`) en las dos, igual que Inicio.
- B. Perfil mantiene el texto plano `profile-pets-empty` y solo se suprime la tarjeta; Recordatorios recibe `EmptyState`.
- Recomendación: A, para coherencia, esperando el cierre de #176/#177 (ver D4).

**D4. Orden y dueño frente a #176/#177 (referencia circular).**
- A. #181 primero, con `EmptyState` actual; #176/#177 lo rehacen después y heredan.
- B. #176/#177 primero; #181 hereda `EmptyState` ya canónico y solo añade ramas.
- Recomendación: B si el humano tolera la espera. Si no, A y el spec nombra #176/#177 como quien reabre los candados de `EmptyState`. En cualquier caso decidir quién es dueño del centrado de `home-empty`.

**D5. ¿Alcance en Comida y pantallas de detalle?**
- A. Solo Inicio, Perfil, Recordatorios (lo que dijo el humano).
- B. Todas las que comparten causa (con D2-A se arreglan gratis).
- Recomendación: D2-A y listar las demás como cubiertas por la raíz, con su sonda.

**D6 (humano).** ¿Cómo llegó a la cuenta sin mascotas (cuenta nueva, o borró/limpió mascotas con la sesión abierta)? Determina si el defecto es de selección rancia o hay otro camino que no vi.

## 6. Riesgos para la spec

1. **Hipótesis sin sonda.** El primer paso rojo debe ser un test que monte Home/Reminders/Profile con `selectedPetId` rancio, lista `[]` y `getPet` en 404, y asevere ausencia de `pet-hero-error`/`reminders-error`/`profile-pet-error`. Sin él, el arreglo podría no tocar el síntoma real. No inferir la causa de este informe como hecho (ver memoria «Premisas de explore sin verificar»).
2. **Cambio de API del provider** (`clearPet`) rompe los dobles de `useSelectedPet` en tests de pantalla: grep exhaustivo antes de inventariar ficheros (memoria «Dobles exhaustivos de puertos»).
3. **Mapa no compensa el status bar.** `map-no-pets` centra sin `insets`; replicarlo tal cual en pantallas con header nativo vs tabs sin header cambia el centrado visual. La spec fija si el centrado es del área segura o de la pantalla.
4. **Candados de layout (~20 tests) y ui-copy-table**: cualquier clase o copy nuevo cae en `checkUses(ALL_USES)` (ordenado, por fichero) y en los guards de design-drift. Medir H0 en la base al arrancar; no copiar recuentos de este informe (caducan).
5. **Carrera de merges**: #176, #177, #184, #190 tocan home/profile/EmptyState. Exige «Spec aprobada caduca al mergear su dependencia»; el handoff a Codex debe medir contra el HEAD del handoff.
6. **Interpretación de «centrado»** (D1) sin cerrar produciría una spec inconsistente; no puede decidirla el spec_author.
7. **Regla global fuera de carta.** Cualquier centrado/ancho máximo nuevo requiere enmienda de `docs/conventions.md` §Dimensiones y `docs/ui-guidelines.md` regla 6, con excepción nombrada.
8. **Sondas de transición.** El estado «selección rancia entre el fetch de la lista y el de detalle» es una ventana corta: el test debe fijar la sincronización (`findBy`/`waitFor`) y no asumir orden de resolución (memoria «RNTL 14: fireEvent y act asíncronos»).

## 7. Recomendación

- Spec en dos bloques: (1) raíz (`usePetSelection` limpia selección rancia, + gate por lista en Home/Perfil/Reminders como red) con sonda roja primero; (2) estados sin mascotas centrados al estilo de `map-no-pets` en Home/Perfil/Recordatorios (y Comida si D5-B).
- Resolver D1, D4 y D6 con el humano ANTES de redactar; son las únicas que no puede cerrar el spec_author.
- No aplicar un máximo de ancho global en esta feature; si el humano lo quiere, feature aparte con enmienda de carta.
