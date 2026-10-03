# Implementacion — mobile-tanstack-query (#87)

- Branch: `feature/87-mobile-tanstack-query`
- Base: `main` @ `7f298f2` (la spec declara deltas de candados contra `5666b85`)
- Inicio: 2026-09-10
- Spec: aprobada por humano el 2026-09-10
- Skills: overview del plugin Expo + `native-data-fetching`; la skill literal
  `expo-overview` no existe en la version instalada y su `README.md` es el indice
  oficial del plugin. `tasks.md` descarta las skills de UI porque no se dibuja UI.
- Documentacion Expo leida: referencia versionada SDK 57.0.0.

## Linea base

- `env -u FORCE_COLOR bash ./init.sh`: verde.
- Suite movil: 68 suites, 1111 tests, 1 snapshot; todo verde.
- Typecheck movil: verde.
- Avisos preexistentes: `.env` sin `RESEND_API_KEY`, `RESEND_FROM` y
  `RESET_LINK_HOST`; no bloquean `init.sh` y #87 no usa esas variables.

## Trazabilidad de commits

| Requisito | Commit rojo | Commit verde | Evidencia |
|---|---|---|---|
| R1 | `0f9b0293` | `f9655ada` | 2 aserciones rojas por dependencia ausente; test focal verde |
| R2 | `1775ebe5` | `f37f5f27` | 5 aserciones rojas por opciones ausentes; test focal y typecheck verdes |
| R3 | `82997296` | `2f6c8f8e` | 3 rojos por proveedor ausente; helper aislado y typecheck verdes |
| R4 | `e9cd3778` | `c56df5ea` | orden y sonda verdes; el test desmonta y limpia su cliente para no dejar el timer de `gcTime` abierto |
| R5 | `7e09aa6e` | `b1726090` | `unauthorized` rojo 0/1; callback global verde y no actúa sobre `ok`/`unreachable` |
| R6 | `df05877d` | `dd5f180b` | cache vaciada solo en `unauthenticated`; transicion loading→authenticated conserva datos |
| R7 | `67c40976` | `f6ef34d9` | 14 claves exactas, `limit` y prefijos verdes; typecheck verde |
| R8 | `e5c23b5e` | `1d1fdbb0` | forma minima verde; 10 pantallas antiguas siguen compilando |
| R9 | `cad725dc` | `12c84b76` | 2 entradas de cache, suite de Docs y typecheck verdes |
| R10 | `9645cbcf` | `0d64e42b` | clave con `limit: undefined`; 23 pruebas y typecheck verdes |
| R11 | `284eeb2b` | `73fc423e` | 2 claves; `retryAll` y refresco tras generar preservados; 22 pruebas y typecheck verdes |
| R12 | `3f47ebc0` | `05222fa9` | `enabled` del plan y candado de revalidacion real verdes; 23 pruebas y typecheck verdes |
| R13 | `7e135990` | `84d30862` | 3 claves, peso con `limit: 1`, candado real; 28 pruebas y typecheck verdes |
| R14 | `7fe2c50c` | `e20111de` | 2 claves; foco y mutacion preservados; 22 pruebas y typecheck verdes |
| R15 | `ab66c3b7` | `f79ddf58` | condicion triple, 2 focos y 2 mutaciones verdes; 48 pruebas y typecheck verdes |
| R16 | `cb0b6f98` | `2d75b433` | 3 claves y 3 ficheros de montaje verdes; 35 pruebas y typecheck verdes |
| R17 | `70199d55` | `ee94846d` | 4 claves, foco limitado y candado real; 112 pruebas y typecheck verdes |
| R18 | `b30a0c83` | `aaa5c60a` | 4 claves, sondeo de 15 s y ruta excluida preservados; 49 pruebas verdes |
| R19 | `fbdd3cdd` | `588c691d` | 2 ficheros borrados; solo sobrevive el candado semanal; query keys literales ausentes y 9 `signOut(` de mutación, delta 0 respecto a `5666b85` |
| R20 | `523ef5b5` | `f13d945b` | mutación exacta versionada y revertida; 4 candados rojos con `pet-old`, después 4 verdes; hook idéntico al estado tras R8 |

## Evidencia R20

Mutación versionada en `523ef5b5`: se borró únicamente
`if (pets.isRefreshing) return;` de `use-pet-selection.ts`. Resultado rojo:

- `food.test.tsx` — `does not replace a new selection while the stale pet list refreshes`:
  `not.toHaveBeenCalled()`, 1 llamada recibida con `"pet-old"`.
- `health.test.tsx` — mismo nombre y mismo fallo: 1 llamada con `"pet-old"`.
- `home/index.test.tsx` — mismo nombre y mismo fallo: 1 llamada con `"pet-old"`.
- `use-pet-selection.test.tsx` — `no pisa la selección mientras la pantalla enfocada revalida`:
  `not.toHaveBeenCalled()`, 1 llamada recibida con `"pet-old"`.

Los tres tests de pantalla esperan además una notificación real de rerender del
observer antes de comprobar el candado. Esto elimina una carrera observada en
Home sin cambiar la aserción ni su valor esperado.

## Ajustes asincronos sin relajar aserciones

- R9, `src/screens/docs/index.tsx`: `Button.onPress` no puede recibir
  `query.refetch` directamente porque React Native le pasa un evento que no es
  `RefetchOptions`; se usa `() => void docs.refetch()`. Conducta visible y
  recuento esperado de llamadas intactos.
- R10, `src/app/(tabs)/weight-log.tsx`: mismo ajuste de tipo en el botón de
  reintento, con el mismo comportamiento observable.
- R12, `src/app/(tabs)/food.tsx`: los dos botones de reintento usan el mismo
  adaptador de evento `() => void query.refetch()`.
- R12, `src/app/(tabs)/__tests__/food.test.tsx`: se envolvieron en `waitFor`,
  sin cambiar valores esperados, las cuatro aserciones del esqueleto de plan y
  las cinco aserciones de títulos de card; la actualización de caché notifica en
  un turno asíncrono adicional.
- R13, `src/app/(tabs)/health.tsx`: los dos botones de reintento adaptan el evento
  de React Native y `vaccines.isRefreshing` pasa al equivalente v5
  `vaccines.isRefetching`; no cambia ningún valor esperado.
- R14, `src/screens/reminders/index.tsx`: el botón de reintento adapta el evento;
  el bloque `useFocusEffect` y el `signOut` de la mutación quedan intactos.
- R15, `src/screens/pairing/index.tsx`: el botón de reintento adapta el evento;
  permanecen dos `useFocusEffect` y las dos expulsiones de mutación.
- R16, `src/screens/profile/index.tsx`: el botón de reintento adapta el evento;
  el foco, el refresco tras foto y las dos expulsiones permanecen intactos.
- R17, `src/screens/home/index.tsx`: los dos botones de reintento adaptan el
  evento; el foco sigue llamando solo a mascotas y detalle.
- R17, `src/screens/home/index.test.tsx`: se añadieron esperas de disponibilidad
  antes de las aserciones ya existentes de accesos rápidos, copy inglesa y filas
  de recordatorio/vacuna. La suite completa reveló además que esperar contenedores
  siempre montados (`pet-hero`, `summary-card`, `reminders-section`) dejaba carreras;
  ahora se espera el hijo exacto ya esperado por cada prueba. Ningún matcher ni
  valor esperado cambió.
- R7, `src/api/query-keys.ts`: la propiedad pública `positionKeys.last` se escribe
  como `'last'` para que el barrido histórico de pseudo-clases no confunda
  `last:` de TypeScript con `last:` de Uniwind; la clave y el acceso no cambian.
- R18, `src/app/(tabs)/map.tsx`: los dos botones de reintento adaptan el evento;
  el `useFocusEffect`, su intervalo de 15 s y la exclusión de la ruta quedan
  intactos.
- R18, `src/app/(tabs)/__tests__/map.test.tsx`: la primera aserción del marcador
  del test de sondeo se envolvió en `waitFor` sin cambiar su valor. El helper usa
  el mismo `createQueryClient` de producción con `gcTime: 0` y acepta el callback
  del arnés, conservando verdes las dos aserciones heredadas de `unauthorized` sin
  duplicar el interceptor.

## Cierre

- Suite móvil completa verde: delta **+2 suites**, **+45 tests** y **0 snapshots**
  respecto a `5666b85`; ningún recuento absoluto se usa como candado.
- `bun run typecheck`: verde.
- `bun run lint`: verde, sin errores ni avisos.
- `pgrep -af 'init\.sh'`: `ninguno` antes del cierre.
- `env -u FORCE_COLOR bash ./init.sh`: verde de extremo a extremo (build, suites
  unitarias, infra, móvil, e2e, lint y typecheck).
- Los seis candados numéricos de `design.md` §6.4 tienen delta **0 respecto a
  `5666b85`**. El candado de sondeo conserva `initial + 1`; el catálogo, los
  recuentos de estilos y `TextInput`, y `weekly-activity-chart.test.tsx` no
  cambian.
- Los nueve `signOut(` de mutación tienen delta **0 respecto a `5666b85`** y el
  `signOut` de lectura vive solo en `QueryCache.onSuccess`.
- `use-api.ts` y su test no existen; el único fichero que contiene la subcadena
  histórica es `weekly-activity-chart.test.tsx`, cuya aserción quedó intacta.
- `traceability.md`: R1–R20 cumplidos, sin filas pendientes.
- No se añadió ninguna variable de entorno ni ninguna dependencia aparte de la
  autorizada `@tanstack/react-query@5.102.8`; el lock añade únicamente ésta y su
  `query-core@5.102.8` transitiva.

Avisos no bloqueantes de `init.sh`, ya presentes en la línea base: faltan tres
claves opcionales en `.env`. También avisa que `STATUS.md` declara 69/86 frente a
69/87; ese bookkeeping corresponde al leader y esta sesión no tocó
`feature_list.json` ni `STATUS.md`.

Único gate restante: smoke humano en dev build de Android, no delegable según la
spec. No se abrió ni se mergeó ningún PR.

## Ronda 2 — corrección tras veredicto rechazado

| Defecto | Requisito | Commit de corrección | Resultado |
|---|---|---|---|
| El `Probe` esperaba un nodo ya presente durante la carga | R3 | `2daf16ba` | espera primero el contenido `ok` y conserva intacta la aserción sobre `probe` |
| Tres pruebas de Summary esperaban el contenedor antes que los datos | R17 | `33f31f42` | cada `waitFor` contiene la primera aserción de datos; las restantes siguen fuera con `getByTestId` |

Se repasaron los tests nuevos y modificados por #87 buscando ambos patrones. No
quedó otro caso equivalente: los demás nodos usados como espera aparecen en la
misma rama de render que sus hijos, una vez resuelta la query. No se relajó
ninguna aserción.

### Evidencia de cierre de la ronda

- Test focal R3: 1 suite, 3 tests, verde.
- Test focal Home: 1 suite, 112 tests, verde.
- Suite móvil completa: **10 pasadas verdes consecutivas**, cada una con 70
  suites, 1156 tests y 1 snapshot. Las rachas preliminares en las que cayó `add-pet`
  se reiniciaron; se confirmó el flake #72 y no se tocó por estar fuera de
  alcance.
- Antes de `init.sh`, `pgrep -af 'init\.sh' | grep -v grep` devolvió `ninguno`.
- `env -u FORCE_COLOR bash ./init.sh`: verde de extremo a extremo; la suite
  móvil volvió a quedar verde y `tsc --noEmit` terminó sin errores.
- **No se tocó código de producción**: los dos commits de corrección modifican
  únicamente `test/__tests__/render-with-providers.test.tsx` y
  `src/screens/home/index.test.tsx`. Tampoco se tocó `feature_list.json` ni
  `backend-pet-tracker/`.
