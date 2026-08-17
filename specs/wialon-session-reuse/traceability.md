---
feature: "wialon-session-reuse"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[wialon-session-reuse]]

## Requisitos

| Requisito | Test (archivo::nombre) | Archivo implementado | Commit (hash + mensaje) |
|---|---|---|---|
| R1 | `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts::R1 (wialon-session-reuse #29): el sid se cachea y se comparte entre listUnits() y getMessages()` | pendiente | pendiente |
| R2 | `backend-pet-tracker/src/workers/poller.service.spec.ts::R2 (wialon-session-reuse #29): un ciclo del poller sobre N devices hace un solo token/login` | pendiente | pendiente |
| R3 | `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts::R3 (wialon-session-reuse #29): el sid caducado fuerza un login nuevo` | pendiente | pendiente |
| R4 | `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts::R4 (wialon-session-reuse #29): una sesión inválida se recupera con un re-login transparente` | pendiente | pendiente |
| R5 | `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts::R5 (wialon-session-reuse #29): el segundo fallo se propaga sin bucle y los demás errores no se reintentan` | pendiente | pendiente |
| R6 | `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts::R6 (wialon-session-reuse #29): WIALON_SID_TTL_MS está por debajo de la caducidad de Wialon` | `backend-pet-tracker/src/integrations/wialon/wialon-http.client.ts` | `c3d5b16` *(feat(wialon-session-reuse): export WIALON_SID_TTL_MS (R6))* |
| R7 | `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts::R7 (wialon-session-reuse #29): el token no aparece en logs ni en errores` | pendiente (guarda de seguridad, **nace verde**) | pendiente |
| R8 | `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts::R8 (wialon-session-reuse #29): el puerto y el simulador no cambian` | pendiente (guarda de regresión, **nace verde**) | pendiente |
| R9 | `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts::R9 (wialon-session-reuse #29): docs/wialon-module.md describe la sesión reutilizada` | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(wialon-session-reuse): <desc> (R1,R2)`, con el
commit del test en rojo (`test(wialon-session-reuse): …`) **antes** que el de
la implementación — C4 exige historial rojo→verde por R-id.

## Excepciones a C4 declaradas por adelantado

Lección de #28 (tres paradas por el mismo defecto: guardas ordenadas después
de lo que las vuelve verdes y no incluidas en la lista de excepciones). Aquí
la lista se escribe **antes** de implementar:

| R-id | Por qué nace verde | Qué debe decir su commit |
|---|---|---|
| R7 | El cliente hoy no tiene `Logger` ni `console.*`, y R4-R6 no añaden ninguno. Es una guarda de **seguridad**: asevera que una propiedad que ya se cumple sigue cumpliéndose después del cambio. | "guarda de seguridad, nace verde" |
| R8 | Es una congelación por su propio enunciado: asevera que tres archivos **no** cambiaron. | "guarda de regresión, nace verde" |

**R5 es un caso frontera y está previsto.** Si R4 se implementa con la forma
de [[design]] §D1, tres de sus cuatro `it` (b, c, d) nacen verdes: son las
propiedades que esa forma garantiza por construcción. Solo (a) tiene rojo
propio, y solo si la implementación de R4 hubiera sido recursiva. Si los
cuatro nacen verdes, el implementador **para y reporta** (regla dura de
[[tasks]]) y se añade R5 a esta tabla con el mismo criterio, sin volver a
consultar el gate. **No se fabrica un fallo.**

**R2 no debe nacer verde**: [[tasks]] lo ordena en la misma fase roja que R1
justamente para que tenga su rojo honesto (3 logins con 3 devices). Si aun
así llegara verde, se declara aquí.

## Aserciones anti-vacío obligatorias

Herencia directa de #28 R11 y del hallazgo O4 del review de #25. Cuatro tests
de esta feature leen ficheros con `readFileSync` y aseveran sobre su
contenido — R6(b), R7(b), R8(a), R8(b) y R9. **Un `expect(source).not.toMatch(...)`
pasa igual si `source` es la cadena vacía**, así que cada uno de esos `it`
SHALL asertar además que el fuente leído tiene longitud mínima (> 1000 para
`wialon-http.client.ts`, `fake-wialon.client.ts`, `wialon-client.interface.ts`
y `docs/wialon-module.md`; > 500 para `wialon.errors.ts`, que hoy tiene 26
líneas). Sin esa aserción, el requisito no se da por cubierto.

## Tests que deben quedar verdes SIN editarse

Lista que revisa el `reviewer` (R8). Ninguno cambia de resultado, según el
inventario de riesgo de [[design]]:

| Archivo | Qué cubre |
|---|---|
| `src/integrations/wialon/wialon-http.client.spec.ts` líneas 54, 80, 103, 125, 138 | Los cinco `it` del describe `R4:` de #8 |
| `src/integrations/wialon/fake-wialon.client.spec.ts` | Simulador completo (#8) |
| `src/integrations/wialon/wialon.factory.spec.ts` | Gate `SIM_MODE` (#8 R1) |
| `src/workers/poller.service.spec.ts` (describes de #8, #27, #28) | Poller contra el puerto mockeado |
| `test/ingestion.e2e-spec.ts` y el resto de suites e2e | Corren con `FakeWialonClient` |

## Decisiones abiertas del gate humano

Las tres de [[requirements]] §Decisiones abiertas (OD-1 TTL frente a la
configuración de la cuenta, OD-2 el límite de `token/login` no documentado,
OD-3 smoke con token real). OD-3, si el humano la marca como exigida, es
trabajo **humano**: ningún agente puede correrla. En ese caso su evidencia va
en `progress/impl_wialon-session-reuse.md`, no en esta tabla.

El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
