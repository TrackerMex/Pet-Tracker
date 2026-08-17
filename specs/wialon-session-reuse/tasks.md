---
feature: "wialon-session-reuse"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[wialon-session-reuse]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Reglas de commit (C4 de [[../../CHECKPOINTS|CHECKPOINTS]], no negociables):**
>
> 1. **Un commit por sub-item (1) y otro por sub-item (2), como mínimo.** El
>    commit del test en rojo va **ANTES** que el de su implementación, siempre.
>    Nunca test + implementación + docs en el mismo commit: en #19 se hizo así y
>    quedó registrado como incumplimiento.
> 2. Formato: `test(wialon-session-reuse): <desc> (R<n>)` para el rojo,
>    `feat(...)`/`refactor(...)`/`docs(...)` para el verde
>    (`docs/conventions.md` §Commits).
> 3. Cada `describe` nombra su R-id: `describe('R1 (wialon-session-reuse #29): …')`.
> 4. Tras cada verde, actualizar la fila correspondiente de [[traceability]] —
>    nunca al final de todo.
>
> **Regla dura heredada de #27 y #28**: si un test que esta lista pide en rojo
> nace **verde**, o si esta spec se contradice con el código real, **para y
> reporta** en `progress/impl_wialon-session-reuse.md`. No fabriques un fallo y
> no edites un test existente para ponerlo verde. Las únicas excepciones a C4
> previstas en esta feature son **R7 y R8**, que nacen verdes por ser guardas
> (de seguridad y de regresión); están tabuladas en [[traceability]].
>
> **El orden de abajo es el orden de ejecución.** R1 y R6 van primero porque
> introducen el campo y la constante de los que depende todo lo demás; R4/R5
> (el reintento) van después del caché porque sin caché el re-login no tiene
> nada que invalidar; R8 (la congelación) va al final, cuando ya hay un diff
> que congelar.

---

## Bloque A — el caché

## R6 — La constante `WIALON_SID_TTL_MS`

> Va primero: R1 y R3 la usan. Su `it` (a) puede escribirse en rojo trivial
> (la constante no existe ⇒ error de compilación de TypeScript, que cuenta
> como rojo).

- [ ] (1) Escribir test que falla para R6 en
      `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts`:
      `describe('R6 (wialon-session-reuse #29): WIALON_SID_TTL_MS está por
      debajo de la caducidad de Wialon')` con los dos `it` de [[requirements]]
      R6 — el de valor (`4 * 60_000`, y `< WIALON_DOCUMENTED_INACTIVITY_MS`
      declarada en el propio test) y el de fuente (`readFileSync`, contiene
      `help.wialon.com` y `WIALON_SID_TTL_MS`, no casa con `/240_?000/`,
      longitud > 1000).
- [ ] (2) Implementación mínima: `export const WIALON_SID_TTL_MS = 4 * 60_000;`
      en `wialon-http.client.ts`, junto a las constantes de las líneas 5-8, con
      el JSDoc de [[design]] §D2 — que **debe** incluir la URL
      `https://help.wialon.com/en/api/expert-articles/faq/frequently-asked-questions`
      y la frase de los 5 minutos de inactividad.
- [ ] (3) Refactor con tests verdes.

## R1 — El sid se cachea y lo comparten `listUnits()` y `getMessages()`

- [ ] (1) Escribir test que falla para R1 en el mismo archivo:
      `describe('R1 (wialon-session-reuse #29): el sid se cachea y se comparte
      entre listUnits() y getMessages()')` con los dos `it` de [[requirements]]
      R1 — (a) una instancia, `listUnits()` + 3 × `getMessages()` ⇒ **1**
      `token/login`, `calls` de longitud 5, las 4 no-login con `sid-123`;
      (b) dos instancias ⇒ **2** logins.
- [ ] (2) Implementación mínima ([[design]] §D1): campos privados
      `sid: string | null = null` y `sidExpiresAtMs = 0`, método privado
      `session()`, y `listUnits()`/`getMessages()` llamándolo. **Todavía sin
      `callWithSession()`** — en este paso basta con sustituir
      `await this.login()` por `await this.session()`. `login()` y `call()` no
      se tocan.
- [ ] (3) Refactor con tests verdes.

## R2 — Un ciclo del poller sobre N devices hace un solo login

> **Su test se escribe en la MISMA fase roja que el de R1**, es decir entre el
> sub-item (1) y el sub-item (2) de R1: antes de que exista el caché, un ciclo
> sobre 3 devices hace 3 logins y el test está genuinamente rojo. Si se escribe
> después de R1(2) nace verde y hay que declararlo como excepción — evitable,
> así que evítalo. Es el criterio de aceptación 1 medido donde importa: el
> bucle del poller, no una llamada suelta.

- [ ] (1) Escribir test que falla para R2 en
      `backend-pet-tracker/src/workers/poller.service.spec.ts`:
      `describe('R2 (wialon-session-reuse #29): un ciclo del poller sobre N
      devices hace un solo token/login')`, con el stub de `fetch` duplicado
      local ([[design]] §D8), tres asignaciones activas y el servicio
      construido con `new PollerService(store, new WialonHttpClient(BASE_URL,
      TOKEN, fetchFn), sqsStub().client, NAMES)` — **no** con el helper
      `makeService` de la línea 93, que tipa el cliente como
      `MockOf<WialonClient>`. Rojo esperado: 3 `token/login`, se espera 1.
- [ ] (2) Sin implementación propia: lo verde lo pone R1(2). Si hace falta
      tocar `poller.service.ts` para que pase, **para y reporta**: R8(c)
      congela ese archivo y significaría que el diseño está mal.
- [ ] (3) Refactor con tests verdes.

## R3 — El sid caducado fuerza un login nuevo

- [ ] (1) Escribir test que falla para R3 en el mismo archivo:
      `describe('R3 (wialon-session-reuse #29): el sid caducado fuerza un login
      nuevo')` con `jest.useFakeTimers().setSystemTime(...)` /
      `jest.useRealTimers()` y los tres `it` de borde de [[requirements]] R3
      (`TTL - 1` ⇒ 1 login; `TTL` exacto ⇒ 2 logins con `sid-456` en la
      segunda; `TTL * 3` ⇒ 2 logins).
- [ ] (2) Implementación mínima: la comparación
      `this.sid !== null && Date.now() < this.sidExpiresAtMs` dentro de
      `session()` y el `this.sidExpiresAtMs = Date.now() + WIALON_SID_TTL_MS`
      tras el login. **Borde exclusivo por arriba**: en `Date.now() ===
      sidExpiresAtMs` se re-loguea.
- [ ] (3) Refactor con tests verdes.

## Bloque B — el reintento

## R4 — Re-login transparente ante sesión inválida

- [ ] (1) Escribir test que falla para R4 en el mismo archivo:
      `describe('R4 (wialon-session-reuse #29): una sesión inválida se recupera
      con un re-login transparente')` con los dos `it` (`{error: 1}` y
      `{error: 1011}`) y las seis aserciones de [[requirements]] R4.
- [ ] (2) Implementación mínima en dos piezas:
      - en `backend-pet-tracker/src/integrations/wialon/wialon.errors.ts`,
        `WIALON_INVALID_SESSION_CODES` e `isInvalidSessionError()` con el
        cuerpo literal de [[design]] §D3 (incluida la URL en el JSDoc);
      - en `wialon-http.client.ts`, el método privado `callWithSession()` de
        [[design]] §D1, y `listUnits()`/`getMessages()` pasando por él.
        **Respetar las tres propiedades de D1**: `await this.session()` fuera
        del `try`, el reintento llamando a `this.call` (no a
        `callWithSession`), y solo `isInvalidSessionError` invalidando el
        caché.
- [ ] (3) Refactor con tests verdes.

## R5 — Sin bucle, y los demás errores no se reintentan

- [ ] (1) Escribir test para R5 en el mismo archivo:
      `describe('R5 (wialon-session-reuse #29): el segundo fallo se propaga sin
      bucle y los demás errores no se reintentan')` con los cuatro `it` de
      [[requirements]] R5 (a: dos logins y dos `load_interval`, `calls` de
      longitud 4; b: `{error: 4}` sin reintento; c: transporte que no invalida
      el caché; d: el `token/login` que falla no se reintenta).
      **Aviso**: (b), (c) y (d) probablemente nazcan **verdes** si R4 se
      implementó con la forma de D1 — es lo esperado, son las tres propiedades
      que esa forma garantiza. Solo (a) tiene rojo propio si la implementación
      de R4 fue recursiva. Si los cuatro nacen verdes, **para y reporta** antes
      de commitear, y anota la excepción en [[traceability]].
- [ ] (2) Sin implementación nueva si R4 se hizo con la forma de D1. Si algún
      `it` falla, el arreglo es **acercarse a D1**, no añadir contadores de
      intentos ni banderas.
- [ ] (3) Refactor con tests verdes.

## Bloque C — secreto, congelación y documentación

## R7 — El token no aparece en logs ni en errores

- [ ] (1) Escribir test para R7 en `wialon-http.client.spec.ts`:
      `describe('R7 (wialon-session-reuse #29): el token no aparece en logs ni
      en errores')` con `TOKEN = 'super-secret-wialon-token'`, los espías de
      los cinco `console.*` sobre los cuatro caminos, la comprobación de
      `message`/`stack`/`String(error)` en cada rechazo, y el `it` de fuente
      (sin `console.` ni `@nestjs/common` en los dos archivos de producción,
      con aserción anti-vacío de longitud > 500).
      **Este test nace verde** (el cliente hoy no loguea nada, y R4-R6 tampoco
      añaden logs): es una **guarda de seguridad**, excepción declarada a C4 en
      [[traceability]]. Decirlo explícitamente en el mensaje del commit. Va
      después de R4/R5 para que cubra también los caminos nuevos.
- [ ] (2) Sin implementación. Si algún `it` falla, hay una fuga real: quitarla
      antes de seguir, y reportarla en `progress/impl_wialon-session-reuse.md`.
- [ ] (3) Commit verde único, con la excepción declarada en el mensaje.

## R8 — El puerto y el simulador no cambian

- [ ] (1) Escribir test para R8 en `wialon-http.client.spec.ts`:
      `describe('R8 (wialon-session-reuse #29): el puerto y el simulador no
      cambian')` con los dos `it` de fuente de [[requirements]] R8 y sus
      aserciones anti-vacío. **Nace verde** por definición (guarda de
      regresión): excepción declarada a C4 en [[traceability]], decirlo en el
      mensaje del commit.
- [ ] (2) Sin implementación. Evidencia complementaria: `git diff --name-only`
      contra `main` sin ninguna ruta bajo `src/integrations/wialon/` fuera de
      `wialon-http.client.ts`, `wialon.errors.ts` y `wialon-http.client.spec.ts`
      — pegarla en `progress/impl_wialon-session-reuse.md`.
- [ ] (3) Commit verde único, con la excepción declarada en el mensaje.

## R9 — `docs/wialon-module.md` describe la sesión reutilizada

- [ ] (1) Escribir test que falla para R9 en `wialon-http.client.spec.ts`:
      `describe('R9 (wialon-session-reuse #29): docs/wialon-module.md describe
      la sesión reutilizada')`, leyendo
      `join(__dirname, '..', '..', '..', '..', 'docs', 'wialon-module.md')` y
      aseverando las subcadenas de [[requirements]] R9 (contiene
      `WIALON_SID_TTL_MS`, `1011`, `token/login`; **no** contiene `por token en
      cada ejecución`), con aserción anti-vacío.
- [ ] (2) Implementación mínima: reescribir la línea 36 de
      `docs/wialon-module.md` y el párrafo de errores de la línea 47-48 para
      recoger el `sid` cacheado por instancia, `WIALON_SID_TTL_MS` (4 min, por
      debajo de los 5 min de inactividad de Wialon) y el re-login único ante
      `{error: 1}` / `{error: 1011}`. No duplicar el valor en más sitios: el
      doc referencia la constante por nombre, igual que hace con los umbrales
      de `pipeline/constants.ts`.
- [ ] (3) Refactor con tests verdes.

## R-sin-id — evidencia de proceso

> No es un requisito (no tiene fila en [[traceability]] §Requisitos), es la
> obligación de dejar rastro que exige `AGENTS.md`.

- [ ] (1) Abrir `progress/impl_wialon-session-reuse.md` en el **primer** commit
      de la feature, no al final.
- [ ] (2) Registrar durante el trabajo: decisiones tomadas, cualquier
      contradicción encontrada en esta spec (**parar y reportar**, precedentes
      #21/#27/#28), qué tests nacieron verdes y por qué, la corrida final de
      `./init.sh` con exit code y recuento de suites, y el `git diff
      --name-only` de R8(2).
- [ ] (3) Cerrar [[traceability]] sin ninguna fila "pendiente" y verificar que
      `git log --oneline` de la branch muestra el rojo antes del verde para
      R1, R2, R3, R4, R5, R6 y R9 (R7 y R8 nacen verdes por excepción).

---

## Orden de dependencias (resumen)

```
R6 (constante)
   ↓
R1 rojo + R2 rojo  →  R1(2) implementa el caché  →  los dos verdes
   ↓
R3 (expiración)
   ↓
R4 (re-login) → R5 (sin bucle)
   ↓
R7 (secreto, nace verde) → R8 (congelación, nace verde) → R9 (docs)
```
