---
feature: "mobile-map-staleness-single-source"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Diseño — [[mobile-map-staleness-single-source]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[tasks]] para el orden TDD y `docs/ui-guidelines.md` para la carta de UI que
> rige todo lo móvil.

---

## Decisiones abiertas — las firma el humano en el gate

> Estas tres son las únicas decisiones que esta spec **no** cierra por su
> cuenta. El resto del documento asume que se firman tal como se recomiendan.

### D1 — Qué fuente manda para el badge del Mapa

**Recomendación: la vía (a).** El Mapa consume `device.connectivity` del
detalle de la mascota para el badge, y `staleSeconds` se queda **solo** para el
texto de antigüedad de `stat-updated`.

**Por qué, a la luz del hecho 4 de [[requirements]].** `staleSeconds` mide la
antigüedad de la última **posición**; `connectivity` mide la antigüedad del
último **mensaje** del collar. No son el mismo dato con dos umbrales: son dos
preguntas distintas. Un collar que manda heartbeat sin fix GPS está *online* y
con la posición *vieja*, y eso hoy ya produce en pantalla una Home que dice
"En línea" y un Mapa que dice "Desactualizado" — **con los dos umbrales en 120
s**. La contradicción que motiva esta feature no nace de que los números puedan
divergir: nace de que hay dos cálculos. Sincronizar el número no la arregla;
borrar uno de los dos cálculos sí.

Tras la vía (a) no queda un segundo cálculo que pueda desviarse: la Home lee
`deviceConnectionState(detail.data.pet.device)` (`src/screens/home/index.tsx:244`)
y el Mapa leerá `deviceConnectionState(pet.device)` **del mismo recurso, bajo la
misma clave de query** (`petKeys.detail(petId)`). El estado deja de ser algo que
cada pantalla deriva y pasa a ser algo que las dos leen.

**Coste medido de (a):**

| Concepto | Antes | Después |
|---|---|---|
| `useQuery` en `map.tsx` | 4 | **5** |
| Peticiones nuevas de red en el caso común | — | **0**: la Home (`home/index.tsx:182-186`), Profile (`profile/index.tsx:112`) y Docs (`docs/index.tsx:53`) ya pueblan `petKeys.detail(petId)` con la **misma** clave; al llegar a la pestaña Mapa desde la Home, TanStack Query sirve de caché |
| Peticiones nuevas con el Mapa abierto | — | **+1 cada 15 s** (R7 suma el detalle al `POLL_MS` que ya existe y ya hace 2 peticiones por ciclo → 3) |
| Ficheros de producción tocados | — | **2** (`map.tsx`, `utils/device-connectivity.ts`) |
| Ficheros de test tocados | — | **3** (`map.test.tsx`, `device-connectivity.test.ts`, `design-drift.test.ts`) |
| Claves i18n nuevas | — | **0** |
| Dependencias nuevas | — | **0** |
| Ficheros de backend tocados | — | **0** |

**Qué pasa con los tres estados actuales:**

| Hoy (`map.tsx:192-197`) | Mañana (R2) | ¿Cambia lo que ve el usuario? |
|---|---|---|
| `position === null` → `map.noSignal` ("Sin señal") | `deviceConnectionState(device)` es `none` (sin collar) o `unknown` (`connectivity` nula o valor desconocido del proveedor) → `map.noSignal` | Coincide en el caso real de "sin collar". Cambia en un caso: collar online **sin** posición todavía → ahora "En vivo" en vez de "Sin señal", con el overlay `map-empty` diciendo "Sin datos de ubicación todavía". Es la lectura correcta: el collar habla, el GPS aún no fija |
| `staleSeconds <= 120` → `map.live` ("En vivo") | `online` → `map.live` | Coincide siempre que el collar hable y el fix sea fresco (el caso en régimen) |
| `staleSeconds > 120` → `map.stale` ("Desactualizado") | `offline` → `map.stale` | Diverge justo en el caso que motiva la feature: collar callado con fix reciente → ahora "Desactualizado" (antes "En vivo"); collar hablando con fix viejo → ahora "En vivo" (antes "Desactualizado"). Ver **D3** |
| — | detalle sin resolver o en error → `'—'` (R3) | Estado nuevo. Antes el badge siempre tenía texto porque su dato llegaba con la posición |

**Por qué NO la vía (b)** ("la API expone el umbral y el móvil borra la
constante"), con dos motivos independientes:

1. **Está bloqueada por la propiedad de ficheros de esta ronda.** Exponer el
   umbral significa un campo nuevo en el contrato de posiciones, y en el móvil
   ese contrato es `LastPosition` en
   `mobile-pet-tracker/src/api/types.ts:104-111` — fichero que lleva #98 en
   paralelo y que esta feature tiene prohibido tocar. No es una preferencia de
   diseño: es que (b) no se puede implementar en esta ronda sin invadir #98.
2. **No arregla el problema.** Deja dos cálculos vivos y comparte solo el
   número; la contradicción de pantalla del párrafo anterior sobrevive intacta.
   Además convierte un umbral de dominio del backend en parte del contrato
   público de la API, que es acoplamiento nuevo a cambio de nada.

- [X] **D1 firmada por el humano** — vía (a)

### D2 — El rótulo del tile pasa de "GPS" a "Conexión"

El tile `stat-gps` se rotula hoy `t('map.gps')` → "GPS" (`map.tsx:352`). Si el
badge pasa a reportar el enlace del collar (D1), un tile rotulado "GPS" que dice
"En vivo" porque hay heartbeat **miente**: el usuario leería una afirmación
sobre el GPS que el dato no respalda.

**Recomendación: rotularlo `t('pairing.connection')`.** Esa clave ya existe en
los dos idiomas (`catalog.ts:288` "Connection" / `:598` "Conexión") y ya la usa
Pairing para la fila que muestra **exactamente este dato**
(`src/screens/pairing/index.tsx:440-443`). Delta de catálogo cero, y el mismo
dato pasa a llamarse igual en las dos pantallas que lo enseñan.

Se asume una arruga: la clave vive en el espacio de nombres `pairing.*` y se
consume desde el Mapa. El catálogo es plano y esto ya pasa en otros sitios;
renombrarla a `map.connection` sería tocar `src/i18n/catalog.ts`, prohibido
aquí.

**Si el humano rechaza D2**: el tile conserva "GPS", R6 se retira de
[[requirements]], `map.test.tsx:1172` no se toca, y queda escrito que el rótulo
no describe el dato.

- [X] **D2 firmada por el humano** — rótulo `pairing.connection`

### D3 — La consecuencia visible que hay que aceptar

Con D1 firmada, **`stat-updated` y `stat-gps` pasan a poder decir cosas
distintas a propósito**: "Conexión: En vivo" junto a "Actualizado: hace 2 h" es
la lectura correcta de un collar que manda heartbeat sin fix GPS, y va a
aparecer en el smoke. Antes era imposible porque los dos tiles salían del mismo
número.

La pregunta que el humano responde al firmar, sin que nadie la infiera por él:
**¿se acepta que el Mapa muestre "En vivo" con una posición de horas, porque lo
que está vivo es el collar y no el fix?** Si la respuesta es no, D1 decae y la
feature vuelve a diseño: no hay una vía (a) que evite esto, porque es
precisamente el dato que (a) empieza a mostrar.

- [X] **D3 firmada por el humano** — consecuencia aceptada

---

## Decisiones técnicas (cerradas, no se re-litigan)

### D4 — El candado de "no pueden discrepar" vive en la función compartida

El acuerdo entre Home y Mapa **no** se puede cerrar comparando textos: la Home
rotula los estados con `home.free|unknown|offline|online`
(`src/screens/home/index.tsx:111-119`) y el Mapa con
`map.noSignal|stale|live`. Son palabras distintas para el mismo estado, y
unificarlas pediría claves nuevas o editar `home/index.tsx` — las dos
prohibidas en esta ronda.

Lo que sí se cierra es que **el estado sea uno solo**, con dos piezas:

1. **`MAP_CONNECTION_LABEL_KEY` vive en
   `src/utils/device-connectivity.ts`**, junto a `deviceConnectionState`, y su
   tipo es `Record<DeviceConnectionState, TranslationKey>`. El `Record` sobre el
   union hace que el typecheck exija un caso por estado: si alguien añade un
   quinto `DeviceConnectionState`, el Mapa no compila hasta decidir qué pinta.
   El test de R1 **conduce siempre a través de `deviceConnectionState(device)`**
   —nunca escribe un estado literal— así que asevera la propiedad que importa:
   la etiqueta del Mapa es función **del estado compartido y de nada más**.
   Cualquier reintroducción de `staleSeconds` en esa decisión rompe la forma de
   la tabla.
2. **El candado de umbral es un grep sobre el árbol** (R5), en
   `src/__tests__/design-drift.test.ts`, que es donde este repo ya guarda sus
   candados de drift sobre el fuente y donde ya existen los helpers
   `filesMatching` / `filesContaining` (`:49-59`). Muere en cuanto alguien
   vuelve a meter un umbral local en el móvil, esté donde esté — por eso la
   prueba de mutación de [[requirements]] §Requisito de verificación se planta
   en dos ficheros distintos y no solo en `map.tsx`.

Juntas: (1) impide que el Mapa decida el estado por su cuenta, (2) impide que
nadie vuelva a introducir el número. Ninguna de las dos toca un fichero de #98.

### D5 — `map.tsx` NO se migra a `src/screens/` en esta feature

Decisión cerrada por el leader antes de escribir esta spec. La pantalla del Mapa
sigue siendo un route file grueso en `src/app/(tabs)/map.tsx`, incumpliendo la
convención #39 (`docs/ui-guidelines.md` §Decisiones fijas 8: route delgado +
pantalla en `src/screens/`).

**Queda pendiente y se deja constancia aquí**: migrarla es alcance ajeno a
unificar la fuente de frescura, y la feature **#95 ya mueve pantallas**, que es
donde corresponde. Mezclar el movimiento de fichero con el cambio de conducta
haría ilegible el diff que el reviewer tiene que juzgar, y dejaría los deltas de
línea de `map.test.tsx` —que esta spec declara uno a uno— sin referencia
estable.

### D6 — El detalle entra en el poll existente, no en uno nuevo

R7 añade `refetchDetail()` dentro del `setInterval(..., POLL_MS)` que
`map.tsx:140-158` ya tiene, y **no** crea un segundo temporizador ni añade
`refetchInterval` a la query. Motivo: el `useFocusEffect` ya resuelve el
arranque, la parada y la limpieza; duplicar esa maquinaria por un tercer recurso
es coste sin ganancia. El guardarraíl existente (`if (!selectedPetId || lastKind
=== 'no-tracking') return;`) se conserva tal cual.

Sin R7 el gate humano de R8 no significaría nada: con el badge congelado hasta
el próximo foco, Home y Mapa no podrían observarse cambiando a la vez.

### D7 — El defecto del doble de `getPet` en `map.test.tsx` es un collar `online`

`map.test.tsx:47-50` mockea `'../../../api/pets'` con una **factory
exhaustiva**: `{ listPets, setLostMode }`. En cuanto `map.tsx` importe `getPet`
de ese módulo, el mock devuelve `undefined` y **las 49 pruebas del fichero
revientan**, no solo las del badge. Por eso la factory y el `beforeEach` se
tocan antes que nada (tarea R2-(1) de [[tasks]]).

El valor por defecto es un collar **`online`**, y esa elección es la que mantiene
el delta en dos pruebas en vez de en diez: los 47 casos que no hablan del badge
siguen viendo "En vivo" exactamente igual que hoy con `staleSeconds: 15`.

> **No copies el doble de otra suite.** `map.test.tsx` **no** tiene hoy ningún
> factory de `DeviceStatus`; la que sí lo tiene es
> `src/utils/device-connectivity.test.ts:7-15` (`makeDevice`), y su forma vale
> como **intención**, no como texto a calcar: el nuevo factory de `map.test.tsx`
> se escribe contra el `DeviceStatus` real de `src/api/types.ts:44-50`
> (`model`, `batteryPct`, `connectivity`, `lastMessageAt`, `esn`) y se coloca
> junto a `makePet` (`:117`), reutilizando el patrón `overrides` del propio
> fichero. Verifica qué mocks tiene ya `map.test.tsx` antes de añadir
> cualquiera: los de `expo-maps`, `expo-router`, `react-native-safe-area-context`
> y `uniwind` ya están puestos y no se duplican.

---

## Archivos afectados

Capa: **infrastructure (cliente móvil)** en los cuatro casos. Esta feature no
tiene código de dominio ni de aplicación; no toca `backend-pet-tracker/`.

### Producción

- **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — añade el export
  `MAP_CONNECTION_LABEL_KEY: Record<DeviceConnectionState, TranslationKey>` con
  el reparto de R1. No cambia ninguna función existente: `deviceConnectionState`
  y `connectivityLabelKey` se conservan intactas, y sus 8 tests actuales deben
  seguir verdes sin editarse.

- **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — cuatro cambios y ninguno
  más:
  1. `:76` — **se borra** `const STALE_SECONDS = 120;` (R5). `POLL_MS` en `:77`
     se conserva: no es un umbral de frescura, es una cadencia.
  2. `:9` y `:19-27` — el import de `'../../api/pets'` suma `getPet`; se importan
     `deviceConnectionState` y `MAP_CONNECTION_LABEL_KEY` de
     `'../../utils/device-connectivity'`.
  3. `:86-107` — nuevo `useQuery` con `queryKey: petKeys.detail(selectedPetId ?? '')`,
     `queryFn: () => getPet(baseUrl, token ?? '', selectedPetId!)` y
     `enabled: selectedPetId !== null`, calcado de la forma que ya usan las otras
     cuatro queries del fichero y de la de `home/index.tsx:182-186`.
  4. `:192-197` — `const gps = ...` deja de mirar `position`/`staleSeconds` y
     pasa a resolverse desde el detalle (R2) con el guion de R3 como caída;
     `:191` (`updated = fmtAgo(position.staleSeconds, t)`) **no se toca** (R4);
     `:352` cambia `t('map.gps')` por `t('pairing.connection')` (R6, si D2 se
     firma); `:140-158` suma `refetchDetail()` al intervalo (R7).

### Tests

- **`mobile-pet-tracker/src/utils/device-connectivity.test.ts`** — añade
  `describe('#94 R1: ...')`. Los dos describes existentes (`R16: ...` y
  `#73 R6: ...`) no se tocan.

- **`mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`** — deltas
  declarados uno a uno en §Delta de `map.test.tsx`.

- **`mobile-pet-tracker/src/__tests__/design-drift.test.ts`** — añade
  `describe('#94 R5: ...')` al final. Los describes existentes (`C8: ...`,
  `R3: ...`, `R4: ...`, `R9: ...`, `R11 (mobile-device-pairing): ...`) no se
  tocan.

---

## Delta de `map.test.tsx` — declarado por ruta:línea y valor nuevo

> Base: `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` en el commit
> **`914905b8`** — 1273 líneas, **49 tests**, suite verde (medido).
>
> **Todas las cifras de abajo son deltas contra ese commit, no recuentos
> absolutos.** Si el fichero se ha movido bajo tus pies, reancla por el texto
> citado antes de editar; nunca por el número de línea a secas.

### Andamiaje (sin el cual revienta el fichero entero — ver D7)

| Línea | Qué cambia |
|---|---|
| `:11-16` | el import de `'../../../api/pets'` suma `getPet` y `type PetState` |
| `:29-34` | el import de tipos de `'../../../api/types'` suma `DeviceStatus` |
| `:47-50` | la factory `jest.mock('../../../api/pets', ...)` suma `getPet: jest.fn()` |
| `:108-115` | suma `const mockGetPet = jest.mocked(getPet);` |
| tras `makePet` (`:117-145`) | nuevo factory local `makeDevice(connectivity: string \| null): DeviceStatus`, junto a `makePet`, con la forma real de `src/api/types.ts:44-50` (ver el aviso de D7) |
| `:229-244` (`beforeEach`) | suma el defecto `mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ device: makeDevice('online') }) })` |

### Casos existentes: dos se conservan, tres cambian de valor

| Caso | Línea | Delta declarado |
|---|---|---|
| `staleSeconds: 15` del caso "latest speed… live GPS" | **`:547`** | **se conserva verbatim**. La aserción `'En vivo'` de **`:570`** **también se conserva**: con el collar `online` por defecto el texto no cambia. Lo que cambia es su causa, y por eso R2 añade el caso espejo que lo demuestra |
| `staleSeconds: 121` del caso "shows stale GPS…" | **`:584`** | **se conserva verbatim** (sigue siendo 121) |
| aserción `'Desactualizado'` de ese mismo caso | **`:600-601`** | **valor nuevo: `'En vivo'`**. Un fix de 121 s con el collar hablando es exactamente el caso del hecho 4. La aserción de `stat-updated` = `'hace 2 min'` de `:604` se conserva y pasa a ser la carne del caso: el tile de antigüedad sigue diciendo la verdad mientras el de conexión dice otra cosa (R4) |
| título de ese caso | **`:581`** | **valor nuevo**: `'#94 R2: la antigüedad de la posición ya no mueve el tile de conexión'` — el título viejo ("shows stale GPS") describiría algo que el caso ya no hace. Se retitula bajo R2 porque lo que asevera es que el badge dejó de seguir a `staleSeconds`; R4 aporta aparte su propio caso explícito de los dos tiles a la vez |
| aserción `'Sin señal'` del caso "collar has never reported" | **`:676`** | **se conserva el valor `'Sin señal'`**, y el caso suma `mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ device: null }) })` para producirlo por la vía nueva. `stat-updated` = `'—'` de `:678` se conserva sin cambio (lo sigue moviendo `position === null`). Título nuevo: `'#94 R2: sin collar el tile de conexión dice Sin señal'` |
| aserción `screen.getByText('GPS')` del caso "conserva los cuatro tiles…" | **`:1172`** | **valor nuevo: `screen.getByText('Conexión')`** — solo si **D2** se firma. Las otras tres (`'Velocidad'`, `'Distancia'`, `'Actualizado'`) se conservan, igual que el recuento de cuatro tiles y su orden de lectura |
| caso `'deja sus cuatro recursos en las claves canónicas'` de `#87 R18` | **`:1234-1273`** | el `describe` y las cuatro aserciones de clave existentes **se conservan**; el caso suma `mockGetPet.mockResolvedValue(petDetailState)` y una quinta aserción `expect(queryClient.getQueryData(petKeys.detail('pet-1'))).toEqual(petDetailState)`. Título nuevo: `'deja sus cinco recursos en las claves canónicas'`. Es un delta sobre un requisito de #87 y por eso se declara aquí en vez de dejarlo implícito |

### Casos nuevos

Ocho pruebas nuevas, en cuatro describes nuevos al final del fichero:
`#94 R2` (4), `#94 R3` (2), `#94 R4` (1), `#94 R7` (1). Más el `#94 R6` (1) si
D2 se firma. Detalle en [[tasks]].

### Delta neto esperado

`map.test.tsx` pasa de **49** tests a **58** (o **57** si D2 se rechaza).
`device-connectivity.test.ts` pasa de **8** a **13**.
`design-drift.test.ts` suma **2**.
La suite móvil completa suma esas pruebas y **no pierde ninguna**: ningún caso
existente se borra en esta feature.

---

## Alternativas descartadas

- **(b) La API expone el umbral y el móvil lo consume.** Bloqueada por
  propiedad de ficheros (`src/api/types.ts` es de #98) y, aun sin ese bloqueo,
  no resuelve el problema: deja dos cálculos y comparte solo el número. Detalle
  en **D1**.
- **Mover `STALE_SECONDS` a una constante compartida del móvil** (p. ej.
  `src/utils/constants.ts`). Sigue siendo una copia del
  `DEVICE_ONLINE_THRESHOLD_MS` del backend, en otro repositorio y sin nada que
  las ate: exactamente la deuda que esta feature cierra, solo que con un
  fichero más. Incumple además el criterio "ninguna constante de umbral
  duplicada en `mobile-pet-tracker/`".
- **Pedir `GET /v1/pets/:petId/device` en vez del detalle.** El endpoint existe
  (`backend-pet-tracker/src/modules/devices/infrastructure/pet-device.controller.ts:43`)
  y devuelve el mismo `DeviceStatusResponse`, pero **no** está en la caché de
  nadie: costaría una petición de red de verdad en cada entrada al Mapa, donde
  `petKeys.detail(petId)` la sirve gratis porque Home, Profile y Docs ya la
  pueblan. Además habría que darle una clave nueva en `src/api/query-keys.ts` y
  una función nueva en la capa de API, cuando `getPet` ya existe y ya está
  probada.
- **Que el badge combine los dos datos** (p. ej. "En vivo" solo si el collar
  está online **y** el fix es fresco). Vuelve a introducir el umbral en el móvil
  —lo que R5 prohíbe— y además inventa un cuarto estado sin copy: "online pero
  sin fix" no tiene clave en el catálogo y crearla está prohibido en esta ronda.
- **Añadir un test que renderice la Home y el Mapa en el mismo fichero** para
  comparar sus textos. Obliga a duplicar todo el andamiaje de mocks de la Home
  (ocho módulos de API) en una suite ajena, que es justo el patrón que rompió el
  Skeleton del hero en #73. El acuerdo se cierra en la función compartida
  (**D4**), que es donde de verdad puede romperse.
- **Migrar `map.tsx` a `src/screens/` de paso.** Ver **D5**.

---

## Nota de entorno para el implementador

Esto no lo ve ningún test y sí lo ve el gate humano. Antes de tocar una línea:

1. **Borra `mobile-pet-tracker/.expo/types/router.d.ts`** si existe. Está
   gitignorado y rompe el typecheck con rutas fantasma. (En el worktree donde se
   escribió esta spec no existía; en el tuyo puede haberse regenerado.)
2. **`bun` y `bunx` para todo**, nunca `npx` ni `npm i -g`. Si `node_modules`
   está desfasado —`Cannot find module '@tanstack/react-query'` es el síntoma
   exacto que apareció al medir el baseline de esta spec— corrige con
   `bun install` desde `mobile-pet-tracker/`, que es local al worktree.
3. **`(tabs)` va escapado, o usa `--runTestsByPath`.** Un argumento posicional
   de jest es una **regex**: `(tabs)` sin escapar casa con `src/app/tabs/`, que
   no existe, y el fichero **se salta en silencio con exit 0**
   (`docs/conventions.md` §Filtros de jest con rutas que llevan paréntesis).
   Comandos verificados en este worktree:

   ```bash
   cd mobile-pet-tracker
   bunx jest --runTestsByPath \
     'src/app/(tabs)/__tests__/map.test.tsx' \
     'src/utils/device-connectivity.test.ts' \
     'src/__tests__/design-drift.test.ts'
   ```

   **Comprueba siempre que el número de suites que imprime jest coincide con el
   de ficheros que pediste** (aquí: 3).
4. **Mide los gates sin pipe.** `./init.sh | tail` devuelve el código de salida
   de `tail`, no el de `init.sh`.
5. **No corras `./init.sh` mientras otra sesión lo esté corriendo**: LocalStack y
   Postgres son compartidos entre worktrees y colisionan.
6. **Carga las skills de Expo antes de escribir código**: `expo-overview` como
   entrada y, desde ella, `expo-data-fetching` (la query nueva de TanStack
   Query) y `expo-native-ui` (el tile). Es obligación de la carta de UI
   (`docs/ui-guidelines.md` §Skills: quién carga qué), también para Codex CLI,
   que las tiene vía su plugin `expo`.

---

## Enmienda E1 — D8: la forma de la tabla la dicta el candado de #65

> Añadida el 2026-09-21 sobre la spec aprobada. Detalle, inventario fila a fila
> y casilla de firma en [[requirements]] §Enmienda E1. D1, D2 y D3 siguen
> firmadas y **no se tocan**; D4-D7 tampoco cambian.

### D8 — `MAP_CONNECTION_LABEL_KEY` se escribe con `{ labelKey }`

`ui-language.test.ts:38-63` (`checkUses`, candado de #65) reconoce exactamente
dos formas de resolver copy, y ninguna otra: `t('<clave>')` y
`labelKey: '<clave>'`. La tabla que D4 dejó especificada —
`Record<DeviceConnectionState, TranslationKey>`, con `online: 'map.live'`— **no
es ninguna de las dos**. Consecuencia, si se implementa tal cual: R2 borra los
`t('map.live')` / `t('map.stale')` / `t('map.noSignal')` de `map.tsx`, sus tres
filas de `R4_MAP` pasan a esperar 1 y encontrar 0, y el candado se pone rojo sin
que quede sitio donde contar esas claves.

La forma que sí ve el candado, y que además **ya está en ese mismo fichero tres
líneas más arriba** (`src/utils/device-connectivity.ts:6-12`,
`DEVICE_CONNECTIVITY_META`), es la de objeto con `labelKey`:

```
Record<DeviceConnectionState, { labelKey: TranslationKey }>
```

Se adopta esa. No es una capa de envoltorio gratuita: es el precio de que la
resolución de copy siga siendo auditable desde la tabla de #65 cuando la clave
vive en un módulo compartido y no en la pantalla. El acceso en `map.tsx` gana un
`.labelKey`, y nada más cambia: el badge sigue saliendo de
`deviceConnectionState(pet.device)` y de ninguna otra cosa, que es lo que D4
cierra.

Alternativas descartadas dentro de E1:

- **Dejar el `Record<…, TranslationKey>` y registrar las filas igual.**
  `checkUses` cuenta ocurrencias **en el fuente**: sin `labelKey:` ni `t(`, el
  recuento sería 0 y la fila roja. La tabla de #65 no admite una tercera forma
  sin tocar `checkUses`, y `ui-language.test.ts` es un candado de otra feature:
  ablandarlo para que quepa esta es exactamente lo que no se hace.
- **Resolver el texto dentro de `device-connectivity.ts` con un `t()` propio.**
  Ese módulo es puro y no conoce el provider de idioma; meterle `useTranslate`
  lo convertiría en un hook y rompería su test unitario y sus tres consumidores.
- **Un bloque nuevo `R94_MAP_CONNECTION` en `ui-copy-table.ts`** en vez de
  ampliar `R10_PAIRING`. Obliga a tocar `ALL_USES` (`:420-433`), el array
  `blocks` (`:443-447`), la lista de imports de `ui-language.test.ts:4-19` y a
  añadir un `describe` — cuatro sitios más, para un dato que ya vive donde debe:
  las filas de `src/utils/device-connectivity.ts` están en `R10_PAIRING` desde
  #73 R6, porque es el bloque del **módulo compartido**, no el de la pantalla de
  Pairing. Se amplía ese bloque con un término nombrado (`42 + 2 + 1 + 4`), que
  es el idioma que el propio fichero ya usa en `:133` y `:168`.

### Qué NO se mueve, y hay que resistirse a tocar

`ui-language.test.ts:438` fija `expect(SCREEN_FILES).toHaveLength(19 + 2 + 1)`
— 22 ficheros distintos derivados de `ALL_USES`. E1 **no** registra ningún
fichero nuevo: `src/utils/device-connectivity.ts` ya está en la tabla
(`ui-copy-table.ts:375-377`). Esa línea se queda como está. Lo mismo
`ui-copy-table.ts:449-451`, que cuadra `ALL_USES` contra la suma de los doce
bloques: es consistencia interna y se recalcula sola.

### Archivos afectados — adenda de E1

A la lista de §Archivos afectados se suman dos ficheros de test, **ninguno de
#98**:

- **`mobile-pet-tracker/src/__tests__/ui-copy-table.ts`** — `R4_MAP` pasa de 20
  a 17 filas; `R10_PAIRING` gana 4 filas de `src/utils/device-connectivity.ts`.
- **`mobile-pet-tracker/src/__tests__/ui-language.test.ts`** — dos
  `toHaveLength` y un título. Ninguna otra línea.

Y en producción, `src/utils/device-connectivity.ts` cambia de forma (no de
conducta) según D8.

---

## Enmienda E2 — D9: el candado de umbral pasa de regex a inventario

> Añadida el 2026-09-21 tras el rechazo de la primera revisión (H2). Detalle,
> tabla declarada, prueba de fuego y casilla de firma en [[requirements]]
> §Enmienda E2. E1, D1-D3 y D4-D8 siguen firmadas y **no se tocan**. El
> bloqueante H1 lo corrige Codex en la ronda 2 y no entra aquí.

### D9 — Se asevera el inventario de lecturas, no la forma de la comparación

El candado de R5 persigue **sintaxis**: busca `staleSeconds` pegado a un
operador relacional. Esa partida se pierde siempre, porque hay infinitas formas
de escribir la misma comparación, y H2 demostró la más barata de todas —un
alias de una línea— con el candado en verde y exit 0.

R10 cambia de eje. La observación que lo hace posible: **el móvil solo tiene una
puerta a la antigüedad de la posición, y se llama `staleSeconds`.** Cualquier
umbral local, con el alias que sea y con la forma que sea, tiene que leer ese
identificador en algún sitio. Así que en vez de mirar *qué se hace* con el valor
—inagotable— se asevera *cuántas veces y dónde se lee* —finito, hoy dos sitios—:

```
inventario_real(fuentes de producción de src/) === tabla declarada
```

con la tabla en `{ 'api/types.ts': 1, 'app/(tabs)/map.tsx': 1 }`. La mutación de
H2 sube `map.tsx` a 2 y el inventario no cuadra: rojo. Un umbral mudado a
`src/utils/`, a `device-connectivity.ts` o a un helper nuevo aparece como
**clave inesperada**: rojo también. Y ninguna de las dos cosas depende de cómo
esté escrita la comparación.

**No es una cifra congelada de las que caducan.** El `1` de `map.tsx` no es un
recuento incidental del fichero: es literalmente lo que R4 promete conservar
—una sola lectura, la de `fmtAgo`—. Y el candado es de **consistencia interna**
contra una tabla declarada junto a él, así que una feature futura que necesite
una segunda lectura legítima actualiza la tabla en su mismo commit y deja escrito
por qué, que es la disciplina de siempre. Lo que ya no puede pasar es que entre
sin que nadie se entere.

### El idioma no se inventa: ya vive ocho líneas más arriba

`design-drift.test.ts:409` declara
`const screenSignOutCalls: Record<string, number>` y `:472-485` compara los
recuentos por fichero con `toEqual`. R10 es ese mismo patrón aplicado a
`staleSeconds`, con **una mejora deliberada**:

`screenSignOutCalls` construye el observado con
`Object.keys(screenSignOutCalls).map(…)`, es decir **solo mira los ficheros que
ya declara**: un fichero nuevo le es invisible. R10 construye el observado
**escaneando todos los fuentes de producción** (77 hoy) y quedándose con los que
tienen al menos una lectura. Por eso caza la mudanza a un fichero nuevo, que es
la mitad del agujero de H2. Un inventario, no una lista de la compra.

### Compatibilidad con H1: R10 no toca el helper compartido

H1 rechazó la ronda 1 por modificar `sourceFiles()` (`:25-37`), del que cuelgan
los 14 candados preexistentes del fichero. **R10 no lo usa ni lo toca.**
Reutiliza `allTypeScriptFiles()` (`:39-49`, sin cambios; ya lo usan `:437` y
`:441`) y aplica **su propio filtro local**, dentro del `describe` de `#94 R10`,
para quedarse con los fuentes de producción: fuera las carpetas `__tests__/` y
fuera los `*.test.ts(x)` colocados.

Verificado además que la corrección de H1 no mueve el resultado de R10: ningún
test colocado bajo `src/` contiene `staleSeconds`, así que el inventario sale
idéntico con el helper viejo y con el nuevo.

### Cómo se cuenta

`(contents.match(/\bstaleSeconds\b/g) ?? []).length`, con frontera de palabra.
Se aparta a propósito del `contents.split('signOut(').length - 1` de `:480`:
aquel cuenta subcadenas, y aquí una frontera de palabra evita que un
`staleSecondsLabel` cualquiera infle el recuento y produzca un rojo que no
significa nada. El coste es el mismo y la señal es más limpia.

### Alternativas descartadas dentro de E2

- **Ampliar el regex de R5 con más formas** (alias, ternarios, `Math.min`,
  desestructuración, `??`). Es perseguir sintaxis a base de parches: cada
  evasión nueva pide otro parche y el candado nunca queda cerrado. Lo dijo el
  encargo y se suscribe aquí.
- **Reescribir R5 en vez de añadir R10.** R5 está firmado con su letra exacta y
  la implementación la cumple; cambiarlo es modificar un requisito aprobado
  (C6) y deja huérfanos sus commits en [[traceability]]. Razonado en
  [[requirements]] §Enmienda E2.
- **Análisis de flujo de datos** (seguir el valor de `staleSeconds` hasta una
  comparación) con el AST de `typescript`, que ya es devDependency y ya se usa
  en `ui-language.test.ts:382-408`. Cierra exactamente la propiedad que
  interesa, pero cuesta un recorrido con seguimiento de asignaciones y alias
  —decenas de líneas de analizador dentro de un fichero de candados— para
  distinguir casos que el inventario ya descarta de un plumazo. Si algún día el
  inventario resulta insuficiente, este es el siguiente escalón, no antes.
- **Prohibir el literal `120` en el móvil.** Ni cubre `2 * 60` ni un umbral leído
  de otro sitio, y choca de frente con los `120` legítimos que ya hay en el
  árbol (`maxLength={120}`, `height: 120`, `TOOLTIP_WIDTH`).

### Archivos afectados — adenda de E2

- **`mobile-pet-tracker/src/__tests__/design-drift.test.ts`** — un `describe`
  nuevo al final con **un** `it` y su tabla declarada. `sourceFiles()`
  (`:25-37`), `allTypeScriptFiles()` (`:39-49`) y el `describe` de `#94 R5`
  (`:488-500`) **no se tocan**.

Ningún fichero de producción cambia por E2, y ninguno es de #98.
