# Spec de #87 `mobile-tanstack-query` — resumen para el gate

- **Spec**: `specs/mobile-tanstack-query/` (`requirements.md`, `design.md`,
  `tasks.md`, `traceability.md`)
- **Branch**: `feature/87-mobile-tanstack-query` (base `main` @ `5666b85`)
- **Estado**: `spec_ready`, frontmatter en `draft`. **No autoaprobada.**
- **Requisitos**: R1–R20. Ninguna línea de código de aplicación escrita.

---

## 1. Discrepancias detectadas (el enunciado de #87 tenía cuatro fallos)

Verificadas contra el árbol, no contra la descripción. Detalle en
`requirements.md` §0.

| Id | Qué decía el enunciado | Qué es verdad | Consecuencia en la spec |
|---|---|---|---|
| **D1** | pedía justificar `retry` como si hubiera reintentos posibles | `src/api/*.ts` tiene **cero `throw`**, y `http.ts` captura toda excepción de `fetch` (`:15-26`, `:36-52`, `:61-73`) y `readJson` la de `json()`. La promesa **siempre resuelve**: un fallo de red es un valor (`kind:'unreachable'`), no un rechazo | `retry: false` explícito, porque cualquier otro valor es configuración muerta. `error`/`isError` son siempre `false` en toda la app |
| **D2** | "el `signOut` ante `unauthorized` vive solo en `use-api.ts`" | **Falso**: vive en **siete** ficheros de producción. `use-api.ts:29` es el de **lectura**; los otros seis son de **mutación** (`meal-schedule:100`, `weight-log:107`, `add-pet:136,201`, `add-reminder:101`, `pairing:150,198`, `profile:159`, `reminders:100`) | La invariante que se preserva se reescribió más estrecha: *el camino de lectura tiene un solo sitio*. Las mutaciones no se tocan, y R19 (e) las cuenta como delta para que nadie las "limpie" |
| **D3** | los consumidores a arreglar son diez | Son diez **llamadores**, pero hay un **undécimo importador**: `src/hooks/use-pet-selection.ts:6` importa `type ApiResult`. Borrar `use-api.ts` sin tocarlo rompe el typecheck | **R8**, y va **antes** que las diez pantallas: es la pieza que permite que las dos vías convivan |
| **D4** | "cuatro archivos de test" tocan `use-api` | Son **seis**: los cuatro más `src/hooks/use-pet-selection.test.tsx:10` y `src/screens/home/weekly-activity-chart.test.tsx:505` (`expect(source).not.toContain('use-api')`) | Cada uno tiene destino escrito en §0.5; el de la gráfica **se conserva sin tocar** |

**Matiz añadido** (no llega a discrepancia): el enunciado dice "cada pantalla que
quiere datos frescos al volver monta su propio `useFocusEffect`". Cierto, pero solo
**cinco** de las diez lo tienen (map, home, pairing ×2, profile, reminders). Las
otras cinco no refrescan al foco hoy y la spec prohíbe que empiecen.

**Compatibilidad verificada**: `@tanstack/react-query` v5 más reciente = **5.102.8**,
`peerDependencies: { react: '^18 || ^19' }` → react 19.2.3 ✅. Es JS puro, sin código
nativo ni config plugin, así que RN 0.86.2 y expo ~57.0.14 no entran en juego.

---

## 2. Decisiones cerradas por escrito (Codex no verá la conversación)

1. **`QueryClient`**: `staleTime: 0`, `gcTime: 5 min`, `retry: false`,
   `refetchOnWindowFocus: false`, `refetchOnReconnect: false` — los cinco escritos
   explícitamente, cada uno con su motivo en `requirements.md` §R2.
   `placeholderData: keepPreviousData` **prohibido** (pintaría los datos de la
   mascota anterior al cambiar de mascota).
2. **`refetchOnWindowFocus` en RN**: no se sustituye por nada. React Native no tiene
   `visibilitychange`, así que el `true` por defecto nunca se dispara; montar un
   puente `AppState → focusManager` **añadiría** refetches que hoy no existen, y el
   criterio 5 lo prohíbe. El refresco al recuperar el foco **de pantalla** —otra cosa
   distinta— se queda donde está: los `useFocusEffect` de las cinco pantallas que lo
   tienen, conservados palabra por palabra. Candidato a feature aparte (A3).
3. **`signOut` de lectura**: `QueryCache.onSuccess` dentro de `createQueryClient()`,
   en `src/providers/query-provider.tsx`. Un sitio y solo uno. Se usa `onSuccess` y
   no `onError` por D1.
4. **Migración pantalla a pantalla**, una branch y un PR, diez rojo→verde en orden
   de dificultad creciente (docs → weight-log → meal-schedule → food → health →
   reminders → pairing → profile → home → map). Conviven sin problema porque no
   comparten estado; el único punto de contacto es `usePetSelection`, y R8 lo
   neutraliza cambiando su parámetro al tipo estructural mínimo.
5. **Query keys**: `[dominio, recurso, ...ids, filtros?]` en `src/api/query-keys.ts`,
   único sitio con literales. Las catorce claves del repo tabuladas en R7. El caso
   que importa: `listWeights` se llama con `limit: 1` desde Salud y sin límite desde
   el log de peso, así que la clave **lleva el `limit`** o las dos pantallas se
   pisan.
6. **Helper de tests**: `renderWithProviders` en **`test/render-with-providers.tsx`**
   (no en `src/`, porque los escáneres de fuente de producción de este repo arrancan
   en `src/` y lo tratarían como código de app). Devuelve el `RenderResult` **más**
   `queryClient`, cliente nuevo por llamada, `retry:false` + `gcTime:0`.
7. **Las cinco rutas gordas de `src/app/(tabs)/`**: **se dejan como están** y se
   declara feature aparte (A1 en `design.md` §8). Tres motivos: la propia convención
   dice que las pantallas pre-#39 solo se migran cuando una feature las toca *de
   fondo*; el candado del route delgado (`design-drift.test.ts:112-133`) cubre otras
   cuatro rutas y no éstas, así que no hay regresión que reparar; y mover 1 628
   líneas más sus tests haría ilegible el diff de la feature que toca diez pantallas
   de producción. **No se arregla de tapadillo.**
8. **Candados que se mueven**: **ninguno numérico**. Los seis candados con cifras del
   repo (catálogo, classnames, legibilidad, dependencias, `transformIgnorePatterns`,
   sondeo del mapa) tienen delta esperado **0**, tabulado en `design.md` §6.4, y el
   cierre lo verifica con `git diff 5666b85`. Lo que sí se mueve son tests, y va
   declarado como delta: **−6 `it`** (el fichero `use-api.test.tsx` entero) y **+≥7
   `it`** nuevos, con los seis contratos del fichero borrado re-alojados uno por uno
   en `design.md` §6.1.

---

## 3. Deltas de conducta que el humano debe firmar

El criterio 5 dice "el comportamiento visible no cambia". Es **casi** cierto y la
spec no finge lo contrario: una caché compartida —el motivo de la feature— cambia
*cuándo* ocurren los estados, aunque no *qué* se pinta en cada uno.

- **D-1**: una pantalla de pila (`weight-log`, `meal-schedule`, `docs`) que se
  reabre dentro de `gcTime` pinta el dato cacheado en vez de su esqueleto.
- **D-2**: las siete pantallas que piden `listPets` comparten una petición en vuelo
  en vez de hacer siete.
- **D-3**: un `refetch()` de `['pets','list']` actualiza también las demás pantallas
  montadas que leen esa clave (Home ↔ Perfil).

Ninguno rompe un test —cada test recibe un `QueryClient` nuevo— y los tres son la
razón por la que #78 espera a esta feature. Están en la tabla de
`requirements.md` §Deltas y en el guion del smoke.

---

## 4. Riesgos

| Riesgo | Mitigación en la spec |
|---|---|
| **El mapa** (`map.tsx`): 4 queries, sondeo de 15 s y el test más delicado | Va **el último**. El `useFocusEffect` con `setInterval` se conserva íntegro y `refetchInterval` queda **prohibido** (A6): sondearía con la pestaña invisible. El candado `map.test.tsx:731-733` ya está escrito como delta y vigila que la ruta **no** entre en el tick |
| **Choque de claves** `listWeights` Salud (`limit:1`) vs log de peso (sin límite) | La clave lleva el `limit`; R7 (b) lo canda con una aserción de desigualdad |
| **Los tres `jest.spyOn(apiHooks,'useApi')`** se caen en cuanto su pantalla migra | Se reescriben **en la misma tarea** que su pantalla (R12, R13, R17), con un mecanismo más fuerte que el `hookCall++ % N` que reemplazan; R20 los prueba por **mutación** |
| Tests que necesiten un tick asíncrono más | "Regla de oro" explícita: envolver en `waitFor`/`findBy` conservando el valor esperado **está permitido**; cambiar el valor, borrar la aserción o aflojar `toHaveBeenCalledTimes(n)` **no**. Si una aserción de verdad ya no aplica, se **para** y decide el humano |
| Fuga de datos entre sesiones que **abre** la migración | **R6**: `queryClient.clear()` al pasar a `unauthenticated`. Hoy no puede pasar porque el token forma parte de la identidad de `fn`; con caché de proceso y claves sin token, sí |
| `@tanstack/react-query` y `transformIgnorePatterns` de jest | Publica CJS: no hace falta tocarlo, y R1 lo canda. Si aun así saliera un `SyntaxError`, R1 autoriza **una** corrección concreta y pide anotarla |

---

## 5. Decisiones abiertas para el gate humano

1. Firmar (o rechazar) los tres deltas D-1/D-2/D-3 de §3.
2. Confirmar el pin **exacto** `5.102.8` frente a un rango `^5`.
3. Confirmar que las cinco rutas gordas de `(tabs)/` se quedan y se abre feature
   aparte (§2.7), en vez de arreglarlas aquí.
4. Confirmar que `refetchOnWindowFocus` y `refetchOnReconnect` se quedan en `false`
   sin puente `AppState`/NetInfo (A3, A4).
5. Aprobar el orden pantalla a pantalla frente a una migración de golpe.

---

## 6. Seguimiento — feature a dar de alta cuando el humano quiera

> Enunciado ya redactado para `feature_list.json`, derivado de la decisión §2.7.

**`mobile-thin-tab-routes`** (P3): mover el cuerpo de las cinco rutas de
`mobile-pet-tracker/src/app/(tabs)/` que hoy contienen pantalla completa —
`food.tsx` (323 líneas), `health.tsx` (279), `map.tsx` (391), `meal-schedule.tsx`
(322), `weight-log.tsx` (313)— a `src/screens/<nombre>/index.tsx`, dejando el
fichero de ruta en menos de 10 líneas, y mover sus tests de
`src/app/(tabs)/__tests__/` junto al cuerpo. Cumple `docs/conventions.md`
§Estructura Expo oficial, que hoy solo está candada para cuatro rutas en
`src/__tests__/design-drift.test.ts:112-133`; la feature debe **extender ese
candado** a las cinco nuevas. Sin cambios de conducta: es un movimiento de
ficheros más el ajuste de imports relativos.
