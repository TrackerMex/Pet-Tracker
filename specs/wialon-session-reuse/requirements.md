---
feature: "wialon-session-reuse"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[wialon-session-reuse]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #29 (`description` + los 6 `acceptance_criteria`).
> Todas las rutas de esta spec son relativas a `backend-pet-tracker/` salvo
> que se indique lo contrario.

## Contexto — el fallo exacto

`WialonHttpClient` (`src/integrations/wialon/wialon-http.client.ts`) abre una
sesión nueva en **cada** llamada pública y tira el `sid` al terminar:

```ts
async listUnits(): Promise<WialonUnit[]> {
  const sid = await this.login();          // línea 71
  const response = await this.call<...>('core/search_items', SEARCH_UNITS_PARAMS, sid);
  ...
}

async getMessages(unitId, fromTs, toTs): Promise<RawPosition[]> {
  const sid = await this.login();          // línea 89
  const response = await this.call<...>('messages/load_interval', {...}, sid);
  ...
}
```

`login()` (línea 111) es un `svc=token/login` que devuelve `eid`. El `sid`
vive dentro del cuerpo del método y se descarta al retornar.

`PollerService.pollAssignment()` (`src/workers/poller.service.ts:109`) llama
`getMessages()` una vez por asignación activa, dentro del bucle secuencial de
`runOnce()` (línea 59-61), y el scheduler dispara `runOnce()` cada 60 s. El
coste es entonces **un `token/login` por collar y por ciclo**: 1.440 logins
al día con un collar, 144.000 con 100, 1,44 millones con 1.000. El modo de
fallo al topar cualquier límite del proveedor es el peor posible: la API
empieza a rechazar el login, `getMessages()` nunca llega a ejecutarse y el
poller deja de traer posiciones — visible solo como un log de error por
device en cada ciclo (`poller.service.ts:64-69`), sin alerta ni métrica.

El arreglo obvio —cachear el `sid`— reintroduce el problema que el diseño
actual evita por fuerza bruta: **la sesión de Wialon caduca por
inactividad** (5 minutos según la documentación oficial, ver [[design]] §D2)
y la API responde `{error: 1}` "Invalid session". Cachear sin manejar esa
expiración cambia un fallo silencioso por otro. Por eso el caché (R1-R3) y el
re-login transparente (R4-R5) son **el mismo requisito partido en dos**: ni
uno solo de los dos es aceptable sin el otro.

Hoy no molesta porque solo hay un collar de pruebas (unidad `401775970`, el
smoke real de #24), pero es bloqueante antes de operar flota.

**Nada de esto corre con `SIM_MODE` distinto de `false`**: el factory
(`wialon.factory.ts:29`) devuelve `FakeWialonClient`, que no tiene sesión.
Todos los requisitos de abajo se verifican **sin Wialon real**, con el tercer
parámetro `fetchFn` que el constructor ya acepta (`wialon-http.client.ts:67`)
y que los tests inyectan mockeado.

## Requisitos funcionales

### Bloque A — El sid se cachea y se comparte

- **R1**: WHEN `listUnits()` o `getMessages()` necesitan un `sid` y la misma
  instancia de `WialonHttpClient` ya tiene uno en caché **no expirado**, THEN
  THE SYSTEM SHALL reutilizarlo y SHALL NOT emitir un `svc=token/login`. El
  caché SHALL ser **un par de campos privados de instancia** (el `sid` y su
  instante de expiración en ms) — nunca estado a nivel de módulo, nunca un
  singleton compartido entre instancias. Los dos métodos públicos SHALL leer
  el mismo campo: el `sid` obtenido por `listUnits()` sirve a `getMessages()`
  y al revés.

  - Test: `src/integrations/wialon/wialon-http.client.spec.ts`, describe nuevo
    `R1 (wialon-session-reuse #29): el sid se cachea y se comparte entre
    listUnits() y getMessages()`, con dos `it`:
    - **(a)** sobre **una sola** instancia, `await client.listUnits()` seguido
      de tres `await client.getMessages('900001', 0, 1000)` secuenciales:
      `calls.filter((c) => c.svc === 'token/login')` SHALL tener longitud
      **1**, `calls` SHALL tener longitud **5** en total, y las cuatro
      llamadas no-login SHALL llevar todas `sid === 'sid-123'`.
    - **(b)** **dos** instancias distintas construidas con el mismo `fetchFn`
      hacen **un login cada una** (2 en total): el caché es por instancia. Sin
      este `it`, una implementación con un `static` pasaría (a) y rompería el
      aislamiento entre el proceso NestJS y el script CLI.

- **R2**: WHEN `PollerService.runOnce(now)` completa un ciclo sobre N
  asignaciones activas con un `WialonHttpClient` real inyectado como cliente
  Wialon, THEN THE SYSTEM SHALL haber emitido contra el `fetchFn` inyectado
  **exactamente un** `svc=token/login`, sea cual sea N. Este es el criterio de
  aceptación 1 del `feature_list.json` medido donde importa: el bucle del
  poller, no una llamada suelta.

  - Test: `src/workers/poller.service.spec.ts`, describe nuevo
    `R2 (wialon-session-reuse #29): un ciclo del poller sobre N devices hace
    un solo token/login`, con **tres** asignaciones activas (`storeStub` con
    tres `assignment({deviceId, petId, unitId})` distintos) y el servicio
    construido llamando directamente al constructor —
    `new PollerService(store, new WialonHttpClient(BASE_URL, TOKEN, fetchFn),
    sqsStub().client, NAMES)`— porque el helper `makeService` de la línea 93
    tipa el cliente como `MockOf<WialonClient>`. Aserciones: un solo `svc ===
    'token/login'`, tres `svc === 'messages/load_interval'`, y los tres con el
    **mismo** `sid`. El stub de `fetch` se replica local en este archivo (ver
    [[design]] §D8: no se extrae un helper compartido para dos archivos).

- **R3**: WHEN una llamada pública necesita un `sid` y el instante actual
  (`Date.now()`) es **mayor o igual** que el instante de expiración cacheado,
  THEN THE SYSTEM SHALL emitir un `token/login` nuevo, guardar el `eid`
  devuelto y recalcular la expiración como `Date.now() + WIALON_SID_TTL_MS`.
  El borde SHALL ser exclusivo por arriba: el `sid` vale **mientras**
  `Date.now() < expiración`; justo en `expiración` ya se re-loguea.

  - Test: mismo archivo que R1, describe nuevo
    `R3 (wialon-session-reuse #29): el sid caducado fuerza un login nuevo`,
    con `jest.useFakeTimers().setSystemTime(...)` en el `beforeEach` y
    `jest.useRealTimers()` en el `afterEach` (patrón ya usado en
    `src/pipeline/time-away.spec.ts:97` y
    `src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts:66`),
    y tres `it` que fijan el borde por los dos lados:
    - `jest.advanceTimersByTime(WIALON_SID_TTL_MS - 1)` entre dos
      `getMessages()` ⇒ **1** login.
    - `jest.advanceTimersByTime(WIALON_SID_TTL_MS)` exacto ⇒ **2** logins, y
      la segunda `messages/load_interval` lleva el `eid` del segundo login
      (`'sid-456'`), no el primero.
    - `jest.advanceTimersByTime(WIALON_SID_TTL_MS * 3)` ⇒ **2** logins (no
      uno por TTL transcurrido: se reloguea al usar, no por reloj).

### Bloque B — La sesión inválida se recupera sola, una vez

- **R4**: IF una llamada devuelve una respuesta de **sesión inválida** —
  `{error: 1}` ("Invalid session") o `{error: 1011}` ("Your IP has changed,
  or the session has expired"), los dos códigos verificados contra la tabla
  oficial citada en [[design]] §D3 — THEN THE SYSTEM SHALL, de forma
  transparente para el llamador: (a) invalidar el `sid` cacheado, (b) emitir
  **un** `token/login` nuevo, (c) reintentar **la misma** llamada, con los
  mismos `svc` y `params`, **una sola vez** con el `sid` nuevo, y (d)
  devolver su resultado. El llamador SHALL NOT ver el error: `getMessages()`
  resuelve con sus posiciones y `listUnits()` con sus unidades.

  La detección SHALL vivir en `src/integrations/wialon/wialon.errors.ts` como
  `export const WIALON_INVALID_SESSION_CODES` (los dos códigos) y
  `export function isInvalidSessionError(error: unknown): boolean` — nunca
  como un `if (error.code === 1)` suelto dentro del cliente.

  - Test: mismo archivo que R1, describe nuevo
    `R4 (wialon-session-reuse #29): una sesión inválida se recupera con un
    re-login transparente`, con dos `it` (uno por código), cada uno con el
    stub de fetch devolviendo en orden
    `[LOGIN_OK, {error: 1}, LOGIN_OK_2, loadIntervalFixture]` y
    `[LOGIN_OK, {error: 1011}, LOGIN_OK_2, loadIntervalFixture]`, donde
    `LOGIN_OK_2 = { eid: 'sid-456' }`. Aserciones por `it`: la promesa
    **resuelve** con las 3 posiciones del fixture; exactamente **2**
    `token/login`; exactamente **2** `messages/load_interval`; `calls`
    de longitud **4**; la primera `load_interval` lleva `sid-123` y la
    segunda `sid-456`; y las dos llevan **los mismos** `params`.

- **R5**: IF el reintento de R4 vuelve a responder sesión inválida THEN THE
  SYSTEM SHALL propagar `WialonApiError` con ese código **sin un tercer
  intento**: como máximo 2 `token/login` y 2 llamadas al `svc` pedido por
  llamada pública, nunca un bucle. WHILE el error **no** sea de sesión
  inválida (cualquier otro `{error: N}`, o un `WialonTransportError`), THE
  SYSTEM SHALL propagarlo en el primer intento, SHALL NOT re-loguear y SHALL
  NOT invalidar el `sid` cacheado — una caída de red no significa que la
  sesión haya muerto. IF el `token/login` **mismo** falla THEN THE SYSTEM
  SHALL propagar ese error tal cual, sin reintentarlo (el re-login es la
  reacción a un fallo del `svc` de negocio, jamás a un fallo del propio
  login).

  - Test: mismo archivo que R1, describe nuevo
    `R5 (wialon-session-reuse #29): el segundo fallo se propaga sin bucle y
    los demás errores no se reintentan`, con cuatro `it`:
    - **(a)** `[LOGIN_OK, {error: 1}, LOGIN_OK_2, {error: 1}]` ⇒ rechaza con
      `WialonApiError` de `code: 1`; exactamente **2** `token/login`,
      exactamente **2** `messages/load_interval`, `calls` de longitud
      **4** — nunca 5 o más. Es la aserción literal del criterio de
      aceptación 3 ("exactamente dos logins y un solo reintento").
    - **(b)** `[LOGIN_OK, {error: 4}]` ⇒ rechaza con `code: 4`; **1**
      `token/login` y **1** `messages/load_interval` (`calls` de longitud 2).
    - **(c)** un `fetchFn` que resuelve el login, **rechaza** la primera
      `messages/load_interval` con un error de red y resuelve el resto:
      la primera llamada rechaza con `WialonTransportError`, y una segunda
      `getMessages()` inmediata sobre la misma instancia SHALL resolver
      reusando el `sid` — **1** `token/login` en total entre las dos
      llamadas (el transporte no invalida el caché).
    - **(d)** `[{error: 1}]` (falla el propio `token/login`) ⇒ rechaza con
      `code: 1` y `calls` de longitud **1**: el login no se reintenta.

### Bloque C — La constante, el secreto y la no-regresión

- **R6**: El TTL del caché SHALL vivir como
  `export const WIALON_SID_TTL_MS` en
  `src/integrations/wialon/wialon-http.client.ts`, con valor `4 * 60_000` (4
  minutos) y con su justificación escrita en JSDoc en el propio archivo, en
  el mismo estilo que las constantes vecinas (`LOAD_INTERVAL_FLAGS` y
  compañía, líneas 5-8): qué ventana de caducidad de Wialon cubre, **con la
  URL de la fuente**, y por qué el margen es ese. El valor SHALL ser
  **estrictamente menor** que los 5 minutos de inactividad que documenta
  Wialon. SHALL NOT aparecer el literal `240_000` ni `240000` en ningún sitio
  del archivo: el TTL se escribe una vez, como `4 * 60_000`, y se usa por
  nombre.

  - Test: mismo archivo que R1, describe nuevo
    `R6 (wialon-session-reuse #29): WIALON_SID_TTL_MS está por debajo de la
    caducidad de Wialon`, con dos `it`:
    - **(a)** `expect(WIALON_SID_TTL_MS).toBe(4 * 60_000)` con la constante
      importada del cliente, y
      `expect(WIALON_SID_TTL_MS).toBeLessThan(WIALON_DOCUMENTED_INACTIVITY_MS)`
      con `const WIALON_DOCUMENTED_INACTIVITY_MS = 5 * 60_000;` declarada **en
      el propio archivo de test**, con el comentario de la fuente encima. No
      se añade esa segunda constante al código de producción: nadie la usaría
      y sería una cifra ajena que aparenta ser configuración nuestra.
    - **(b)** leer el fuente de `wialon-http.client.ts` con `readFileSync`
      (patrón de `src/pipeline/validate-positions.spec.ts:84`) y asertar que
      contiene `help.wialon.com`, que contiene `WIALON_SID_TTL_MS` y que
      **no** casa con `/240_?000/`. Aserción anti-vacío obligatoria: el
      fuente leído SHALL tener longitud > 1000 (lección de #28 R11 — un test
      de fuente que lee un string vacío pasa en silencio).

- **R7** (seguridad): WHILE `WialonHttpClient` esté en uso, en cualquiera de
  los caminos de R1-R5 (éxito, sesión inválida recuperada, sesión inválida
  agotada, error de API, error de transporte), THE SYSTEM SHALL NOT escribir
  el valor de `this.token` en ninguna salida observable: ni en un log
  (`console.*`, `Logger` de NestJS o cualquier otro), ni en el `message`, ni
  en el `stack` de ningún error que construya, ni en el `sid` que cachea.
  `wialon-http.client.ts` y `wialon.errors.ts` SHALL seguir sin importar
  `@nestjs/common` y sin ninguna llamada a `console.`.

  **Aclaración deliberada**: el token **sí** viaja en el cuerpo del POST de
  `token/login` (`body.set('params', JSON.stringify({token: this.token}))`).
  Eso es el protocolo de Wialon sobre HTTPS, no una fuga, y SHALL seguir
  igual. Lo que este requisito prohíbe es que salga por un canal de
  diagnóstico.

  - Test: mismo archivo que R1, describe nuevo
    `R7 (wialon-session-reuse #29): el token no aparece en logs ni en errores`,
    con `const TOKEN = 'super-secret-wialon-token'` y dos `it`:
    - **(a)** espiar `console.log`, `console.info`, `console.warn`,
      `console.error` y `console.debug` con `jest.spyOn`, ejecutar los cuatro
      caminos de fallo/éxito (el de R1a, el de R4, el de R5a y el de R5c) y
      asertar **cero** llamadas a los cinco espías; y para cada rechazo,
      asertar que `error.message`, `String(error)` y `error.stack ?? ''` no
      contienen `TOKEN`.
    - **(b)** leer los fuentes de `wialon-http.client.ts` y `wialon.errors.ts`
      y asertar que ninguno contiene `console.` ni `@nestjs/common`, con la
      misma aserción anti-vacío de longitud > 500 por archivo.

- **R8**: WHILE se cumplen R1-R7, THE SYSTEM SHALL dejar el contrato del
  puerto y el simulador **sin ningún cambio**. En concreto:

  - **(a)** `src/integrations/wialon/wialon-client.interface.ts`,
    `src/integrations/wialon/fake-wialon.client.ts`,
    `src/integrations/wialon/fake-wialon.client.spec.ts`,
    `src/integrations/wialon/wialon.factory.ts` y
    `src/integrations/wialon/wialon.factory.spec.ts` SHALL quedar **sin
    editar**. `FakeWialonClient` no tiene sesión que reutilizar y el gate de
    `SIM_MODE` no se toca.
  - **(b)** Los cinco `it` existentes de
    `src/integrations/wialon/wialon-http.client.spec.ts` (líneas 54, 80, 103,
    125 y 138, del describe `R4:` de #8) SHALL quedar **verdes sin
    editarse**. Siguen siendo correctos: una instancia recién construida no
    tiene `sid`, así que su primera llamada sigue produciendo exactamente
    `login` + `svc`.
  - **(c)** `src/workers/poller.service.ts`,
    `src/workers/positions-consumer.service.ts`,
    `src/workers/ingestion.module.ts` y `scripts/provision-device.ts` SHALL
    quedar **sin editar**: el cambio es interno al cliente HTTP y ningún
    consumidor se entera.
  - **(d)** No hay migraciones, ni variables de entorno nuevas, ni cambios de
    infraestructura AWS.

  - Test: mismo archivo que R1, describe nuevo
    `R8 (wialon-session-reuse #29): el puerto y el simulador no cambian`, con
    dos `it`:
    - **(a)** el fuente de `fake-wialon.client.ts` SHALL NOT casar con
      `/sid|login|expire|ttl/i` (hoy no casa con ninguno: verificado el
      2026-08-17), con aserción anti-vacío de longitud > 1000.
    - **(b)** el fuente de `wialon-client.interface.ts` SHALL contener
      `listUnits(): Promise<WialonUnit[]>;` y `getMessages(` y SHALL NOT
      contener `sid`, con la misma aserción anti-vacío.
    - Evidencia complementaria para el `reviewer`: `git diff --name-only`
      contra `main` SHALL NO listar ninguna ruta bajo
      `src/integrations/wialon/` distinta de `wialon-http.client.ts`,
      `wialon.errors.ts` y `wialon-http.client.spec.ts`.

- **R9**: THE SYSTEM SHALL actualizar `docs/wialon-module.md` §"API real
  (WialonHttpClient)" — cuya línea 36 hoy afirma *"Login **por token en cada
  ejecución**: `svc=token/login` → `sid` (`eid`)"*, que este cambio vuelve
  falsa — para describir: el `sid` cacheado por instancia, el nombre
  `WIALON_SID_TTL_MS` y su valor, y el re-login único ante los códigos `1` y
  `1011`. `docs/wialon-module.md` es la fuente canónica del módulo (la citan
  los planes 005/006/007 en sus chequeos de deriva); dejarla mintiendo es
  deuda inmediata.

  - Test: mismo archivo que R1, describe nuevo
    `R9 (wialon-session-reuse #29): docs/wialon-module.md describe la sesión
    reutilizada`, que lee
    `join(__dirname, '..', '..', '..', '..', 'docs', 'wialon-module.md')` y
    asevera que **contiene** las subcadenas `WIALON_SID_TTL_MS`, `1011` y
    `token/login`, y que **no contiene** `por token en cada ejecución`
    (subcadenas, nunca el texto completo — patrón de #21 R7 y #28 R13), con
    aserción anti-vacío de longitud > 1000.

## Decisiones abiertas para el gate humano

> Ninguna bloquea la implementación; las tres se resuelven marcando esta
> sección al aprobar. Se dejan escritas porque son exactamente lo que un
> agente no puede verificar solo.

- **OD-1 — El TTL frente a la configuración de la cuenta.** La ventana de
  inactividad de **5 minutos** está confirmada en la documentación oficial de
  Wialon ([[design]] §D2 cita la URL y la frase textual), y por eso R6 fija
  `4 * 60_000`. Lo que **no** es verificable desde fuera es si la cuenta real
  de TrackerMex tiene una ventana más corta por configuración. El riesgo es
  acotado por construcción: si la ventana real fuese menor que 4 minutos, R4
  lo absorbe de forma transparente al coste de un login extra, y el sistema
  sigue correcto — el TTL es una optimización de coste, **la corrección la
  garantiza el reintento**. Acción del humano: confirmar el valor, o indicar
  otro; si indica otro, solo cambia la cifra de R6 y su test (a).
- **OD-2 — El límite de `token/login` no está documentado.** El
  `feature_list.json` afirma que "Wialon aplica límites a token/login". La
  búsqueda en la documentación oficial **no encontró ningún límite numérico**
  para `token/login`; lo único documentado en esa línea son los errores `10`
  ("Reached the limit of concurrent requests") y `1003` ("Only one request of
  given time is allowed at the moment"), que son de concurrencia, no de tasa
  de logins. **La spec no depende de ese dato**: la justificación de la
  feature se sostiene sola (1,44 M de logins/día a 1.000 collares es
  desperdicio y un riesgo de rate-limit aunque el umbral exacto se desconozca)
  y ningún requisito lo cita como hecho. Se registra aquí para que nadie
  convierta una suposición en documentación.
- **OD-3 — Smoke contra el token real.** Ningún requisito lo exige y ningún
  agente puede correrlo (credenciales reales, API real, coste). Si el humano
  lo quiere como condición de cierre, la forma es la de #24: `SIM_MODE=false`
  con el token real contra la unidad `401775970`, dos ciclos de poller
  separados >4 min y contar los `token/login` en el log de la cuenta. Marcar
  abajo si aplica.

## Fuera de alcance

- **Keep-alive de la sesión** (`avl_evts` cada 5 min, o cualquier ping
  periódico para que el `sid` no caduque). Añade un temporizador, un ciclo de
  vida y un modo de fallo nuevos; el caché con TTL + reintento cubre los 6
  criterios sin nada de eso.
- **Un pool de sesiones, una clase `WialonSession`, una interfaz de caché
  genérica o cualquier abstracción nueva.** Son dos campos privados dentro de
  `WialonHttpClient` ([[design]] §D1).
- **Reintento con backoff, jitter o número configurable de intentos.** R4/R5
  fijan **exactamente uno**, sin espera. Un `retry` general de la integración
  es otra feature.
- **Reintentar `WialonTransportError`** (red caída, HTTP 5xx). R5 lo prohíbe
  explícitamente: hoy el poller ya reintenta el device entero en el ciclo
  siguiente, 60 s después.
- **Redactar el token dentro del `message` de `WialonTransportError` si la
  causa lo trajera.** El error de `fetch` no incluye el cuerpo de la petición
  (riesgo residual analizado en [[design]] §D7); añadir un redactor sería
  código defensivo contra un caso no observado.
- **`FakeWialonClient`, el puerto `WialonClient` y el factory / gate
  `SIM_MODE`**: congelados por R8.
- **Los consumidores** (`poller.service.ts`, `provision-device.ts`): no se
  tocan, R8(c).
- **Instrumentación** (contador de logins, métrica EMF, log del re-login). R7
  prohíbe logs con el token; un log sin token sería aceptable pero no lo pide
  ningún criterio, y añadirlo obligaría a meter un `Logger` en una clase que
  hoy no depende de NestJS.
- **Bajar la frecuencia del poller o agrupar unidades por lote en
  `messages/load_interval`.** Es la otra mitad del problema de escala
  (`docs/aws-scalability-review.md` §Poller de ingesta Wialon) y merece su
  propia feature.
- **Migraciones, variables de entorno e infraestructura AWS**: ninguna, R8(d).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-17) ← gate obligatorio antes de implementar
- [X] OD-1 resuelta: TTL `4 * 60_000` **confirmado** (2026-08-17). No se sustituye.
- [X] OD-2 leída (no requiere acción)
- [X] OD-3: smoke con token real ¿exigido para cerrar la feature? **no** (2026-08-17).
      La feature cierra con los tests de fetch inyectado; el smoke contra la
      unidad `401775970` queda opcional y no bloquea el veredicto del reviewer.
