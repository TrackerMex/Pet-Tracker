---
feature: "wialon-session-reuse"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[wialon-session-reuse]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Rutas relativas a `backend-pet-tracker/` salvo que se diga lo contrario.
> `WialonHttpClient` es **infraestructura** (adaptador del puerto
> `WialonClient`): puede leer el reloj y hacer red, y no lo importa nadie de
> `domain`/`application`. El cambio no cruza ninguna capa.

## Decisiones técnicas

### D1 — Dos campos privados dentro de `WialonHttpClient` (R1, R3)

La solución completa es esto y nada más:

```ts
private sid: string | null = null;
private sidExpiresAtMs = 0;
```

Sin clase `WialonSession`, sin interfaz de caché, sin `Map` de sesiones, sin
proveedor nuevo en el módulo. El caché es **por instancia**, no estático: en
el proceso NestJS hay una sola instancia (`IngestionModule` registra
`WIALON_CLIENT` con `useFactory: createWialonClient` y providers de NestJS
son singleton por defecto, `ingestion.module.ts:21-26`), y
`scripts/provision-device.ts` corre en **otro proceso** con su propia
instancia. Un `static` no ganaría nada y rompería el aislamiento entre tests;
R1(b) lo prohíbe con un test.

La forma exacta que se pide implementar — dos métodos privados nuevos, y las
dos públicas reducidas a una línea cada una:

```ts
/** Sid vigente o login nuevo. Válido mientras Date.now() < sidExpiresAtMs (R3). */
private async session(): Promise<string> {
  if (this.sid !== null && Date.now() < this.sidExpiresAtMs) {
    return this.sid;
  }
  const sid = await this.login();
  this.sid = sid;
  this.sidExpiresAtMs = Date.now() + WIALON_SID_TTL_MS;
  return sid;
}

/** call() con sesión: un único re-login+reintento ante sesión inválida (R4, R5). */
private async callWithSession<T>(svc: string, params: unknown): Promise<T> {
  const sid = await this.session();              // fuera del try: un login que
  try {                                          // falla NO dispara reintento
    return await this.call<T>(svc, params, sid);
  } catch (error) {
    if (!isInvalidSessionError(error)) {
      throw error;                               // R5: nada más se reintenta
    }
    this.sid = null;
    this.sidExpiresAtMs = 0;
    return await this.call<T>(svc, params, await this.session());
  }
}
```

`listUnits()` y `getMessages()` cambian su primera línea
(`const sid = await this.login();` + `this.call(..., sid)`) por
`await this.callWithSession(...)`. `login()` y `call()` **no se tocan**: la
firma `call(svc, params, sid?)` ya soporta ambos casos.

Tres propiedades salen de esa forma, y las tres están aseveradas en tests:

1. **El `await this.session()` va fuera del `try`.** Si el propio
   `token/login` falla, el error sale sin entrar al `catch`, así que nunca se
   reintenta un login (R5d). Es la diferencia entre "un reintento" y "un
   bucle" cuando la API devuelve `{error: 1}` al login mismo.
2. **El reintento llama a `this.call`, no a `this.callWithSession`.** No hay
   recursión: como máximo dos intentos, siempre (R5a).
3. **Solo `isInvalidSessionError` invalida el caché.** Un
   `WialonTransportError` deja el `sid` intacto (R5c): la red se cayó, la
   sesión no.

### D2 — TTL: `4 * 60_000`, por debajo de los 5 minutos documentados (R6)

**Fuente verificada** (consultada el 2026-08-17), documentación oficial de
Wialon, *Frequently asked questions about Wialon API*:

> "If no requests are made within 5 minutes of the session, it becomes
> inactive."
> — <https://help.wialon.com/en/api/expert-articles/faq/frequently-asked-questions>

La misma página añade que *"An error with code 1 indicates that the current
session is invalid"* y que *"The token's lifespan is not directly related to
the session"* (el token dura hasta 100 días sin uso; lo que caduca en 5
minutos es la **sesión**).

Valor elegido: **`4 * 60_000` (4 min)**, un 20 % por debajo de la ventana
documentada. Justificación completa, que va literal en el JSDoc de la
constante:

- El poller corre cada 60 s (`ingestion-scheduler.service.ts`), así que con
  el TTL en 4 min un ciclo normal **nunca** re-loguea: 1 login cada 4 minutos
  por proceso (≈360/día) en lugar de N por minuto. Con 1.000 collares eso son
  360 logins/día frente a 1,44 M — cuatro órdenes de magnitud.
- El margen de 1 minuto cubre el caso en que un ciclo tarde y el `sid` haya
  quedado sin usar más de lo previsto.
- **La ventana de Wialon es por inactividad, no absoluta**: cada petición la
  reinicia. Un TTL **absoluto** desde el login (que es lo que implementa D1)
  es por tanto estrictamente más conservador que la regla real, y además
  inmune a que Wialon cambie a una caducidad absoluta. Es también más simple
  que un TTL deslizante: un campo que se escribe en un solo sitio.

**El número no es load-bearing.** Si la ventana real de la cuenta fuese más
corta (ver [[requirements]] §OD-1), R4 lo absorbe: la llamada recibe
`{error: 1}`, re-loguea y devuelve el resultado correcto. El TTL optimiza
coste; **la corrección la garantiza el reintento**. Esa es la razón por la
que esta spec no se bloquea esperando a inspeccionar la cuenta real.

### D3 — Sesión inválida = códigos `1` y `1011`, verificados (R4)

**Fuente verificada** (2026-08-17), tabla oficial de códigos de error:

| Código | Texto oficial | Fuente |
|---|---|---|
| `1` | "Invalid session." | <https://help.wialon.com/en/api/user-guide/error-codes> y <https://sdk.wialon.com/wiki/en/kit/remoteapi/apiref/errors/errors> |
| `1011` | "Your IP has changed, or the session has expired." | <https://help.wialon.com/en/api/user-guide/error-codes> |

Los dos entran en el conjunto. `1011` es el mismo fallo por otra vía (IP
cambiada tras un NAT/reinicio de la instancia, o expiración) y su remedio es
idéntico: re-loguear. Como el reintento es único y acotado, incluirlo no
puede degenerar aunque la IP siga cambiando: dos intentos y se propaga.

**No** entran: `4` (Invalid input), `7` (Access denied), `8` (Invalid user
name or password), `9` (Authorization server unavailable), `10` (Reached the
limit of concurrent requests), `1003` (Only one request of given time is
allowed). Ninguno se arregla re-logueando; `10` y `1003` querrían backoff,
que está fuera de alcance por decisión explícita.

Dónde vive, en `wialon.errors.ts` (el archivo ya declarado en
`files_affected`), junto a los errores que consulta:

```ts
/**
 * Códigos de Wialon que significan "la sesión ya no vale, vuelve a loguear":
 * 1 "Invalid session", 1011 "Your IP has changed, or the session has expired".
 * https://help.wialon.com/en/api/user-guide/error-codes
 */
export const WIALON_INVALID_SESSION_CODES: readonly number[] = [1, 1011];

export function isInvalidSessionError(error: unknown): boolean {
  return (
    error instanceof WialonApiError &&
    WIALON_INVALID_SESSION_CODES.includes(error.code)
  );
}
```

No se crea una clase `WialonSessionExpiredError`. Habría que decidir dónde se
construye (dentro de `call()`, rompiendo el mapeo directo `{error: N}` →
`WialonApiError(N)` que el test de #8 línea 125 asevera) y no aporta nada: el
único consumidor de la distinción es el `catch` de D1, dos líneas más abajo.
`WialonApiError` ya lleva el `code` público.

### D4 — Nada del contrato público cambia (R8)

`listUnits()` y `getMessages()` conservan firma, tipos y semántica. El puerto
`WialonClient` no se toca, así que `FakeWialonClient` sigue siendo una
implementación válida sin editar una línea — no tiene sesión que reutilizar,
sus métodos son funciones puras de `(seed, unitId, slot)`. El factory y el
gate `SIM_MODE` tampoco cambian: con `SIM_MODE` distinto de `false` se
devuelve el fake y nada de esta feature se ejecuta.

Los consumidores (`PollerService`, `scripts/provision-device.ts`) ven
exactamente lo mismo. Es el argumento por el que esta feature es de riesgo
bajo pese a tocar el camino de producción del GPS real: el cambio es
**invisible** por fuera salvo por el número de peticiones HTTP.

### D5 — Concurrencia: **no** se protege el login en vuelo, y por qué

Decisión explícita, porque es la pregunta obvia y dejarla ambigua costaría un
ciclo de review: **no se añade una promesa de login compartida** (el patrón
`private loginInFlight: Promise<string> | null`).

Razones, en orden de peso:

1. **Hoy no hay llamadas solapadas.** `PollerService.runOnce()` abre con un
   guard de solape en memoria (`poller.service.ts:39-42`: si el ciclo
   anterior sigue vivo, el tick se salta) y dentro recorre las asignaciones
   con un `for ... of` **secuencial** con `await` (líneas 59-61). Dos
   `getMessages()` no pueden estar en vuelo a la vez en el proceso NestJS.
   `scripts/provision-device.ts` es un proceso aparte, de una sola llamada.
2. **Si las hubiera, el peor caso es benigno.** Node es de un solo hilo: dos
   llamadas concurrentes que encuentren el caché vacío harían dos
   `token/login`, cada una guardaría su `sid` y ganaría la última escritura.
   Ambos `sid` son válidos en Wialon (permite sesiones simultáneas), las dos
   llamadas usan el suyo, y el estado queda consistente. El coste es **un
   login extra**, que es exactamente lo que hace hoy el código en cada
   llamada. No hay corrupción posible: no hay estado parcial que se pueda
   leer a medio escribir entre dos `await`.
3. **Coste de añadirlo**: un campo más, un camino más y un test más de
   concurrencia, para cubrir un escenario que hoy es inalcanzable.

`ponytail:` techo asumido — sin lock de login en vuelo. Si algún día el
poller pasa a `Promise.all` sobre las asignaciones, o si se comparte una
instancia entre workers concurrentes, el upgrade es un campo
`loginInFlight: Promise<string> | null` en `session()`; hasta entonces es
código muerto. Este párrafo es el aviso.

### D6 — Cómo se prueba todo esto sin Wialon real (R1-R8)

El constructor ya acepta `fetchFn: typeof fetch = fetch` como tercer
parámetro (`wialon-http.client.ts:67`) y `wialon-http.client.spec.ts:24`
tiene un `fetchStub(payloads)` que responde una lista de payloads en orden y
graba `{svc, params, sid}` de cada llamada decodificando el
`application/x-www-form-urlencoded`. **Esa es toda la infraestructura de test
que hace falta**: cero red, cero token real, cero `SIM_MODE`.

Dos extensiones mínimas del stub, dentro del mismo archivo:

- Devolver payloads **por posición** ya vale para R4/R5 (`[LOGIN_OK,
  {error:1}, LOGIN_OK_2, fixture]`), pero hoy `fetchStub` **satura** en el
  último payload (`payloads[Math.min(index, payloads.length - 1)]`). Para los
  `it` que cuentan llamadas exactas eso es lo que se quiere (una llamada de
  más devuelve algo y la aserción de longitud la caza); **no cambiar ese
  comportamiento**.
- Para R5(c) hace falta un stub que **rechace** una llamada concreta: añadir
  un `fetchStubWithFailures(payloads, failAtIndex)` local, o un payload
  centinela. Queda a criterio del implementador, mientras el `it` asevere lo
  que pide [[requirements]] R5(c).

Para R3 se usan **fake timers de Jest**
(`jest.useFakeTimers().setSystemTime(...)` + `jest.advanceTimersByTime(...)`,
`jest.useRealTimers()` en el `afterEach`), patrón ya presente en el repo
(`src/pipeline/time-away.spec.ts:97`,
`src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts:66`).
Los timers modernos de Jest mueven también `Date.now()`, que es lo único que
lee `session()`. **No** se añade un parámetro `nowFn` al constructor: la
regla de "el reloj lo pasa el llamador" de #11/#27 aplica al **núcleo puro**
(`src/pipeline/`), no a un adaptador de infraestructura, y meterlo obligaría
a tocar el factory y el puerto — justo lo que R8 congela.

### D7 — El token: qué se protege y qué riesgo queda (R7)

Hoy el token solo aparece en un sitio: el cuerpo del POST de `token/login`
(`login()`, línea 112). El cliente no tiene `Logger` ni `console`, y los dos
errores de dominio se construyen sin él:

- `WialonApiError`: `` `Wialon API error ${code} on ${svc}` `` — solo código
  y servicio.
- `WialonTransportError`: `` `Wialon transport failure on ${svc}: ${cause.message}` ``
  — interpola el mensaje de la **causa**.

**Riesgo residual, aceptado y nombrado**: si algún día un `fetch` fallase con
un error cuyo `message` incluyese el cuerpo de la petición, el token entraría
por la vía de la causa. No se ha observado: `undici` (el `fetch` de Node)
falla con mensajes del tipo `fetch failed` / `getaddrinfo ENOTFOUND ...`, sin
cuerpo. Añadir un redactor (`message.replaceAll(this.token, '***')`) exigiría
pasar el token a `wialon.errors.ts`, que hoy no lo conoce — mover un secreto
a un archivo más para defenderse de un caso no observado es peor negocio que
el riesgo. Queda **fuera de alcance** en [[requirements]], y este párrafo es
su registro.

Lo que R7 sí cierra con test: cero llamadas a `console.*` en los cuatro
caminos, y el token ausente de `message`/`stack`/`String(error)` en todos los
rechazos que la feature introduce.

### D8 — El stub de `fetch` del test del poller se duplica, no se extrae (R2)

R2 necesita en `src/workers/poller.service.spec.ts` el mismo stub de `fetch`
que ya vive en `src/integrations/wialon/wialon-http.client.spec.ts:24-49`
(~25 líneas). Se **duplica local**, no se extrae a un helper compartido.
Extraerlo significaría un archivo nuevo (`test-support/` no existe hoy en
`src/`), un import cruzado entre dos módulos que hoy no se conocen, y un
punto de acoplamiento entre dos suites — todo para deduplicar 25 líneas de
test entre dos archivos. Si aparece un tercer consumidor, se extrae entonces.

## Archivos afectados

### Modificados — infraestructura (adaptador Wialon)

- `backend-pet-tracker/src/integrations/wialon/wialon-http.client.ts` —
  `export const WIALON_SID_TTL_MS`, campos `sid`/`sidExpiresAtMs`, métodos
  privados `session()` y `callWithSession()`, y las dos públicas pasando por
  él. `login()` y `call()` sin cambios. (R1, R3, R4, R5, R6, R7)
- `backend-pet-tracker/src/integrations/wialon/wialon.errors.ts` —
  `WIALON_INVALID_SESSION_CODES` e `isInvalidSessionError()`. Las dos clases
  existentes sin cambios. (R4, R5)

### Modificados — tests

- `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts` —
  ocho describes nuevos (R1, R3, R4, R5, R6, R7, R8, R9). Los cinco `it`
  existentes del describe `R4:` de #8 **no se editan** (R8b).
- `backend-pet-tracker/src/workers/poller.service.spec.ts` — un describe
  nuevo (R2) más el stub de `fetch` local de D8. Los describes existentes no
  se tocan.

### Modificados — documentación

- `docs/wialon-module.md` — §"API real (WialonHttpClient)", línea 36. (R9)

### No se tocan (verificable con `git diff --name-only`)

- `src/integrations/wialon/wialon-client.interface.ts`
- `src/integrations/wialon/fake-wialon.client.ts` (+ su `.spec.ts`)
- `src/integrations/wialon/wialon.factory.ts` (+ su `.spec.ts`)
- `src/workers/poller.service.ts`, `src/workers/positions-consumer.service.ts`,
  `src/workers/ingestion.module.ts`
- `scripts/provision-device.ts`
- `infra/`, migraciones, `.env.example`

## Inventario de riesgo — qué tests existentes podría romper esto

Auditado el 2026-08-17 sobre el estado de `main` en `bf6fe2c`. La lección de
#27 es que este inventario se hace mirando el **efecto acumulado**, no la
primera línea de cada fixture.

| Test existente | ¿Afectado? | Por qué |
|---|---|---|
| `wialon-http.client.spec.ts:54` ("getMessages hace login por token…") | **No** | Asevera `calls` de longitud 2 sobre una instancia **recién construida**: sigue siendo login + `load_interval`. El caché nace vacío. |
| `wialon-http.client.spec.ts:80` (mapeo de campos) | **No** | Una sola llamada, instancia nueva; no cuenta llamadas. |
| `wialon-http.client.spec.ts:103` (`listUnits`) | **No** | Instancia nueva, asevera `calls[1]`, que sigue siendo `core/search_items`. |
| `wialon-http.client.spec.ts:125` (`{error: 4}`) | **No** | El stub satura en `{error: 4}`, así que el **login** falla con código 4 y sale por `session()` sin reintento (R5d). Hace **dos** `getMessages()` sobre la misma instancia: como el login nunca tuvo éxito, `this.sid` sigue `null` y la segunda llamada vuelve a loguear. Rechaza con `code: 4` las dos veces. Verde sin editar. |
| `wialon-http.client.spec.ts:138` (HTTP 503) | **No** | El login falla con `WialonTransportError` y se propaga; `listUnits()` rechaza igual. |
| `fake-wialon.client.spec.ts` (todo) | **No** | El fake no se toca (R8a). |
| `wialon.factory.spec.ts` (todo) | **No** | El factory no se toca; el constructor conserva firma. |
| `poller.service.spec.ts` (describes de #8/#27) | **No** | Usan `wialonStub()`, un mock del **puerto**, no el cliente HTTP. |
| `test/ingestion.e2e-spec.ts` y demás e2e | **No** | Corren con `SIM_MODE` por defecto ⇒ `FakeWialonClient`. Ninguna suite e2e instancia `WialonHttpClient`. |
| `test/aws-real-ingest.e2e-spec.ts` | **No** | Gated por `AWS_MODE`; usa el fake igualmente. |

Ningún test existente cambia de resultado. Es la razón por la que R8(b) puede
exigir "verdes **sin editarse**" sin excepciones, al contrario que #27 R9(f).

## Alternativas descartadas

- **Keep-alive con `avl_evts` cada 5 min** (lo que recomienda la propia FAQ de
  Wialon para mantener viva una sesión). Requiere un temporizador propio
  dentro del cliente, con su arranque, su parada y su gestión de fallos — y
  un `sid` mantenido a base de peticiones extra no es más barato que
  re-loguear cada 4 minutos. Además haría del cliente un objeto con ciclo de
  vida, que hoy no tiene.
- **TTL deslizante** (renovar la expiración en cada uso, que es lo que
  literalmente hace la ventana de inactividad de Wialon). Con el poller
  llamando cada 60 s, la sesión no caducaría **nunca**, y una sesión eterna
  es exactamente el estado en el que un fallo del lado de Wialon se nota
  tarde. El TTL absoluto la recicla cada 4 minutos por construcción, con un
  campo que se escribe en un solo sitio.
- **Nueva clase de error `WialonSessionExpiredError`.** Ver D3: obligaría a
  decidir el mapeo dentro de `call()` y rompería la garantía
  `{error: N} → WialonApiError(N)` que asevera el test de #8; el único
  consumidor de la distinción está dos líneas más abajo.
- **Inyectar un reloj (`nowFn`) en el constructor** para testear el TTL. Ver
  D6: es infraestructura, no núcleo puro, y tocaría el factory. Los fake
  timers de Jest ya resuelven el test sin código de producción extra.
- **Promesa de login compartida contra logins concurrentes.** Ver D5:
  escenario inalcanzable hoy y benigno si llegara.
- **Reintento genérico con backoff en `call()`.** Convertiría cada error
  transitorio en varias peticiones y varios segundos de latencia dentro de un
  ciclo de poller de 60 s. El poller ya reintenta el device completo en el
  ciclo siguiente.
- **Cachear el `sid` fuera del proceso** (Redis, DynamoDB, SSM) para
  compartirlo entre el worker y el script CLI. Dos procesos, ~360 logins/día
  cada uno: el problema no existe a esa escala y la infraestructura sí
  costaría.
