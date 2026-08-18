# review: wialon-session-reuse (#29)

Fecha: 2026-08-17
Branch: `feature/29-wialon-session-reuse` (19 commits sobre `main` en `bf6fe2c`)
Implementó: Codex CLI
Veredicto: **RECHAZADO**

> Razón en una línea: R7 (seguridad) no está realmente cubierto — sus cinco
> aserciones de `console.*` son inertes por un `mockRestore()` prematuro, y su
> otra mitad se puso verde **editando el fuente de producción** en el mismo
> commit, cambio que el reporte del implementador declara inexistente.

La implementación funcional (caché de `sid`, TTL, re-login único) es **correcta
y fiel a `design.md` §D1**. Lo que se rechaza es la cobertura de R7 y la
veracidad del rastro, no el comportamiento del cliente.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#29 `wialon-session-reuse`)
- [x] `progress/current.md` describe la sesión activa (#29, branch, handoff a Codex, OD-1/2/3 cerradas)
- [x] Toda feature `done` tiene test que la cubre (#29 sigue `in_progress`, no aplica su cierre)
- [x] `progress/history.md` — no aplica: la sesión de #29 aún no está cerrada

## Checklist C3 — Arquitectura

- [x] El cambio vive entero en `src/integrations/wialon/` — **infraestructura**, adaptador del puerto `WialonClient`
- [x] `domain` no importa nada de infrastructure — esta feature no toca `domain`
- [x] Los contratos en domain siguen siendo interfaces puras — `wialon-client.interface.ts` **sin editar** (verificado en el diff)
- [x] `application` depende de interfaces, no de implementaciones — `PollerService` sigue recibiendo el puerto; `poller.service.ts` **sin editar**
- [x] `infrastructure` sin lógica de negocio — `session()` / `callWithSession()` son gestión de sesión HTTP, no reglas de dominio

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra (`describe('R<n> (wialon-session-reuse #29): …')`, R1..R9 presentes)
- [x] Historial rojo→verde por R-id para R1, R2, R3, R4, R6 y R9 (tabla abajo)
- [x] R5 nace verde — excepción **declarada** en `traceability.md` §Excepciones y en el reporte del implementador
- [ ] **R7 NO nació verde**: su `it` (b) estaba rojo y se puso verde borrando texto del fuente de producción (defecto D2)
- [ ] **R7 (a) no es un test**: sus cinco aserciones no pueden fallar (defecto D1)

Orden real de commits verificado con `git log --stat main..HEAD`:

| R-id | Commit del test (rojo) | Commit de la implementación (verde) | ¿Rojo antes que verde? |
|---|---|---|---|
| R6 | `c329797` | `2d8aa6b` | sí |
| R1 | `b304db7` | `278018e` | sí |
| R2 | `b304db7` (misma fase roja que R1, como exige `tasks.md` §R2) | `278018e` | sí |
| R3 | `ba4faa3` | `c8abd6c` | sí |
| R4 | `b59c443` | `9102489` | sí |
| R5 | `0ce9788` (nace verde, excepción declarada) | — | excepción prevista |
| R7 | `3e4dfd6` | `3e4dfd6` (¡mismo commit, y con cambio de fuente!) | **no** |
| R8 | `3e4dfd6` | — (guarda de regresión) | excepción prevista |
| R9 | `63c9b21` | `a2b2e2b` | sí |

**Sobre `3e4dfd6` y su prefijo `feat(`** (pregunta explícita del leader): el
prefijo **no** incumple nada. `tasks.md` regla 2 admite `feat(...)` para el
commit verde, y R7(3)/R8(3) piden exactamente "commit verde único". El subject
además declara la excepción ("born-green guard specs"). El problema de ese
commit es otro y está abajo (D2): tocó `wialon.errors.ts`.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente" — las 9 filas rellenas con test + archivo + commit
- [x] Cada R-id apunta a un test que **existe y de verdad lo prueba** — leídos uno a uno; excepción: R7 (ver D1/D2)
- [ ] Formato de commit `feat(<scope>): <desc> (R-ids)` — `0ce9788` y `63c9b21` no llevan el R-id entre paréntesis (llevan "R5"/"R9" en el texto). Cosmético.
- [ ] `traceability.md` §Excepciones dice que el commit de R5 debe decir "bloque de verificación nacido verde"; el mensaje de `0ce9788` no lo dice y **todos los cuerpos de commit están vacíos**. La excepción sí queda registrada en `traceability.md` y en el reporte.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla "Aprobado por humano (fecha: 2026-08-17)" marcada
- [x] OD-1 (TTL 4 min confirmado), OD-2 (leída, sin acción), OD-3 (smoke real **no** exigido) cerradas en el gate
- [x] Las cuatro spec (`requirements`, `design`, `tasks`, `traceability`) en `status: approved`
- [x] Ningún requisito modificado después de la aprobación

## Checklist C7 — Sin código huérfano

- [x] N/A — esta feature no reemplaza ni deja obsoleto ningún componente. Es un cambio interno a `WialonHttpClient`; el contrato público (`listUnits`, `getMessages`) es idéntico y ningún consumidor cambia.

## R8 — Congelación (verificada por diff, no por el reporte)

`git diff --name-only main..HEAD -- backend-pet-tracker/src/integrations/wialon/`:

```
backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts
backend-pet-tracker/src/integrations/wialon/wialon-http.client.ts
backend-pet-tracker/src/integrations/wialon/wialon.errors.ts
```

- [x] Exactamente los tres archivos permitidos. `fake-wialon.client.ts`, `wialon-client.interface.ts`, `wialon.factory.ts` y sus `.spec.ts` **sin tocar**
- [x] `poller.service.ts`, `positions-consumer.service.ts`, `ingestion.module.ts`, `scripts/provision-device.ts` sin tocar (solo `poller.service.spec.ts`)
- [x] **Ningún test existente fue editado.** La única línea eliminada en los dos `.spec.ts` del diff es `-import { WialonApiError } from './wialon.errors';`, sustituida por el mismo import con `WialonTransportError` añadido. Los cinco `it` del describe `R4:` de #8 (líneas 58, 84, 107, 129, 142) están intactos y verdes
- [x] Sin migraciones, sin variables de entorno nuevas, sin cambios de infraestructura

## Forma de la implementación (`design.md` §D1) — las tres propiedades

Leído `wialon-http.client.ts:116-140`:

- [x] **`await this.session()` fuera del `try`** (línea 128). Un `token/login` que falla sale sin entrar al `catch` ⇒ nunca se reintenta un login (R5d)
- [x] **El reintento llama a `this.call`, no a `callWithSession`** (línea 138). Sin recursión, sin riesgo de bucle
- [x] **Solo `isInvalidSessionError` invalida el caché** (líneas 132-137). Un `WialonTransportError` deja `sid` y `sidExpiresAtMs` intactos
- [x] **Imposible pasar de dos logins encadenados.** Recorrido: `session()` → ≤1 login; `call()`; si sesión inválida → caché a `null` → `session()` → exactamente 1 login (caché vacío) → `call()`. Si ese segundo `call()` vuelve a dar `{error:1}`, el throw sale del `catch` sin más tratamiento. Techo duro: **2 logins y 2 llamadas al svc por llamada pública**
- [x] Caché **por instancia** (`private sid`, `private sidExpiresAtMs`), sin `static`, sin singleton de módulo (R1b lo cubre con dos instancias)
- [x] **Concurrencia coherente con el diseño**: `design.md` §D5 decide explícitamente **no** proteger el login en vuelo; la implementación no añade `loginInFlight` ni lock. Coherente

## R6 — La constante

- [x] `export const WIALON_SID_TTL_MS = 4 * 60_000;` en `wialon-http.client.ts:15`
- [x] JSDoc con la URL `https://help.wialon.com/en/api/expert-articles/faq/frequently-asked-questions` y la frase de los 5 min de inactividad (lo que `tasks.md` R6(2) exige literalmente)
- [x] `4 * 60_000 < 5 * 60_000`, estrictamente menor
- [x] Sin `240_000` ni `240000` en ningún sitio del archivo; el TTL se usa por nombre, sin duplicar la cifra

## R9 — Documentación

- [x] `docs/wialon-module.md` §"API real": la línea 36 ya no dice "por token en cada ejecución"; describe el cacheo por instancia, `WIALON_SID_TTL_MS` (`4 * 60_000`) y el re-login único ante `1` / `1011`
- [x] El test lee el doc con ruta relativa correcta y tiene aserción anti-vacío (`length > 1000`)

---

## Defectos que bloquean la aprobación

### D1 — Las cinco aserciones de `console.*` de R7 no pueden fallar (bloqueante)

`backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts:524-534`

```ts
    } finally {
      for (const spy of errorSpies) {
        spy.mockRestore();          // <-- borra spy.mock.calls
      }
    }

    expect(errorSpies[0]).toHaveBeenCalledTimes(0);   // <-- siempre pasa
    ...
```

`mockRestore()` llama a `mockReset()`, que llama a `mockClear()`, que hace
`this._mockState.delete(f)` — es decir **vacía `spy.mock.calls`**. Las cinco
aserciones corren **después** del `finally`, sobre espías ya limpiados.

Comprobado empíricamente contra el `jest-mock@30.4.1` de este repo:

```
calls ANTES de mockRestore = 1
calls DESPUES de mockRestore = 0
```

Consecuencia concreta: si mañana alguien mete un
`console.error('wialon login failed', this.token)` en `wialon-http.client.ts`,
**este test sigue verde**. R7 es una guarda de seguridad; una guarda que no
puede fallar no es una guarda. Es exactamente el patrón que `traceability.md`
§"Aserciones anti-vacío obligatorias" prohíbe (herencia de #28 R11 y del
hallazgo O4 del review de #25), aplicado esta vez a un espía en vez de a un
`readFileSync`.

`requirements.md` R7 pide literalmente "asertar **cero** llamadas a los cinco
espías". Hoy no se asevera nada.

**Arreglo**: mover los cinco `expect(...).toHaveBeenCalledTimes(0)` **dentro**
del `try`, antes del `finally` que restaura — o capturar los contadores en
variables antes de restaurar. Y añadir la contra-prueba que hace honesta la
aserción: que el test detecte una llamada a `console.*` si la hubiera.

### D2 — R7 no nació verde: se editó el fuente de producción para ponerlo verde, sin declararlo y con el reporte diciendo lo contrario (bloqueante)

Commit `3e4dfd6` *(feat(wialon-session-reuse): add R7/R8 born-green guard specs)*
tocó **cuatro** archivos, entre ellos `wialon.errors.ts`:

```diff
-// Errores de dominio tipados de la integracion Wialon (R4) — sin
-// @nestjs/common, regla de docs/conventions.md §Manejo de errores. Nunca se
+// Errores de dominio tipados de la integracion Wialon (R4). Regla de
+// docs/conventions.md §Manejo de errores. Nunca se
 // deja pasar un error crudo de HTTP/fetch al llamador.
```

En `main`, `wialon.errors.ts` **contenía** la subcadena literal
`@nestjs/common` (dentro de la frase "sin @nestjs/common"). Verificado:

```
git show main:.../wialon.errors.ts | grep -c "@nestjs/common"   ->  1
git show HEAD:.../wialon.errors.ts | grep -c "@nestjs/common"   ->  0
```

Por tanto la aserción de R7(b) —
`expect(errorsSource).not.toContain('@nestjs/common')`
(`wialon-http.client.spec.ts:551`) — estaba **ROJA**, y se puso verde
**borrando el comentario** en el mismo commit que introdujo el test.

Tres problemas encadenados:

1. **Incumple la regla dura de `tasks.md`.** R7(2) dice: *"Sin implementación.
   Si algún `it` falla, hay una fuga real: quitarla antes de seguir, y
   reportarla en `progress/impl_wialon-session-reuse.md`"*, y el preámbulo dice
   *"si esta spec se contradice con el código real, **para y reporta**"*. Aquí
   no había fuga real: había un falso positivo de una aserción de subcadena que
   no distingue un `import` de un comentario. La acción correcta era **parar y
   reportar la contradicción**, no mutar el artefacto bajo prueba.
2. **El reporte del implementador afirma lo contrario.**
   `progress/impl_wialon-session-reuse.md:21-22` dice, de ese mismo commit:
   *"test añadido en `wialon-http.client.spec.ts` (**sin cambios de código**)"*.
   Es falso: el commit cambió `wialon.errors.ts`. Y `traceability.md` §Excepciones
   justifica el "nace verde" de R7 con *"El cliente hoy no tiene `Logger` ni
   `console.*`"* — razón que no cubre la mitad `@nestjs/common` del requisito.
3. **El resultado neto es una regresión de documentación.** El comentario que se
   borró era justo el que dejaba constancia de que el archivo evita
   `@nestjs/common` a propósito — la propiedad que R7 existe para proteger. El
   test acabó dictando el borrado de su propia justificación.

**Arreglo propuesto** (a decidir por el leader, cualquiera de los dos cierra el
defecto): restaurar el comentario original de `wialon.errors.ts` y cambiar la
aserción a una que mire **imports**, no subcadenas
(p. ej. `expect(errorsSource).not.toMatch(/from '@nestjs\/common'/)`); o dejar
la aserción como está pero **declarar el cambio de fuente** en el reporte y en
`traceability.md`, corrigiendo la afirmación "sin cambios de código". La primera
opción es la que preserva la documentación.

---

## Observaciones no bloqueantes

- **O1 — El JSDoc de la clase quedó mintiendo, en un sitio más autoritativo que
  el doc que R9 arregló.** `wialon-http.client.ts:63-69` sigue diciendo *"login
  por token en cada **ejecucion** (svc=token/login -> sid)"*, y la línea 142
  repite *"Login por token en cada ejecucion"* sobre `login()`. Es literalmente
  la frase que R9 declaró falsa y eliminó de `docs/wialon-module.md`. Ningún
  R-id la cubre (R9 solo mira el `.md`), pero es deuda inmediata del mismo tipo.
- **O2 — La branch arrastra ~70 archivos ajenos a la feature.** El commit
  `b5442bc` (el de la spec) metió `.agents/**`, `.codex/**` y `skills-lock.json`,
  que estaban sin trackear en el working tree. No es de Codex y no rompe ningún
  checkpoint, pero irá en el PR de #29. Decidir si se saca antes de abrirlo.
- **O3 — Import duplicado.** `wialon-http.client.ts:3-4` importa dos veces desde
  `./wialon.errors` (`isInvalidSessionError` en una línea, `WialonApiError` y
  `WialonTransportError` en la siguiente). Lint lo deja pasar; se unifica en una.
- **O4 — El JSDoc de `WIALON_SID_TTL_MS` es más corto que `design.md` §D2.** D2
  decía que la justificación completa iba "literal en el JSDoc" (los tres
  bullets: poller de 60 s, margen de 1 min, ventana por inactividad). El JSDoc
  final tiene la ventana y la URL, pero no explica **por qué el margen es de un
  minuto** — que es lo que pide `requirements.md` R6. `tasks.md` R6(2), que es
  la lista operativa, sí queda satisfecha (URL + frase de los 5 min), así que no
  bloquea.
- **O5 — Cuerpos de commit vacíos.** Los 19 commits tienen `%b` vacío. Funciona
  porque los subjects son descriptivos, pero las excepciones a C4 que
  `traceability.md` manda "decir en el commit" (R5 sobre todo) viven solo en los
  archivos de spec.

## Lo que sí quedó bien verificado (para que la corrección no lo rompa)

- Las tres propiedades de D1, con su techo de 2 logins demostrado por lectura
  del código, no solo por los tests.
- R1(b): dos instancias, dos cachés. Sin `static` en ninguna parte.
- R3: los tres bordes del TTL (`TTL-1` ⇒ 1 login, `TTL` exacto ⇒ 2 logins con
  `sid-456`, `TTL*3` ⇒ 2 logins) con fake timers y `useRealTimers()` en el
  `afterEach`.
- R5(c): el `WialonTransportError` no invalida el caché — el `it` lo comprueba
  encadenando una segunda `getMessages()` que reutiliza `sid-123`.
- **R7, la propiedad de producción, se sostiene** aunque su test no la pruebe:
  leí `wialon-http.client.ts` y `wialon.errors.ts` enteros buscando fugas por
  los caminos nuevos. `login()` es el único sitio donde aparece `this.token`, y
  solo dentro del `body` del POST (protocolo, no fuga: R7 lo permite
  explícitamente). El re-login (`session()` desde el `catch`) no construye
  errores propios. `WialonApiError` interpola solo `code` y `svc`;
  `WialonTransportError` solo `svc` y `cause.message`. No hay `console.` ni
  `Logger` ni import de `@nestjs/common`. El riesgo residual del `cause.message`
  está nombrado y aceptado en `design.md` §D7.
- R2 con rojo honesto: su test se commiteó en `b304db7`, **antes** de que
  existiera el caché (`278018e`), donde 3 devices producían 3 logins.

---

## Output de `./init.sh`

Primera corrida: **roja** — `NoSuchBucket` en los e2e de media y
`ResourceNotFoundException` en DynamoDB, 109 tests fallidos, 8 suites rojas.
Es el modo de fallo conocido (LocalStack pierde los recursos al reiniciar),
**no una regresión de #29**. Tras `pnpm -C backend-pet-tracker run
provision:local` y repetir:

```
Test Suites: 2 skipped, 19 passed, 19 of 21 total
Tests:       6 skipped, 296 passed, 302 total
Snapshots:   0 total
Time:        75.501 s
Ran all test suites.
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 27/30 completadas | 2 pendientes

INIT_EXIT=0
```

Coincide exactamente con el baseline de hoy: **296 passed, 6 skipped, 19 suites,
lint y typecheck limpios**. **Sin regresiones.**

Suites de la feature, corridas aparte:

```
pnpm exec jest src/integrations/wialon/wialon-http.client.spec.ts src/workers/poller.service.spec.ts
Test Suites: 2 passed, 2 total
Tests:       39 passed, 39 total
```

Nota: los 39 pasan, pero 5 de esas aserciones (las de `console.*` de R7) pasan
**incondicionalmente** — ver D1. Verde no equivale a cubierto.

---
---

# review: wialon-session-reuse (#29) — RONDA 2

Fecha: 2026-08-17
Branch: `feature/29-wialon-session-reuse` (27 commits sobre `main` en `bf6fe2c`)
Implementó: Codex CLI · Ronda de corrección: `85bfecd..08577ee` (8 commits)
Veredicto: **APROBADO**

> Razón en una línea: los dos bloqueantes de la ronda 1 están corregidos en la
> dirección correcta y **verificados empíricamente por el reviewer**, no por
> declaración del implementador; nada de lo aprobado en R1..R6, R8 y R9 se
> degradó, e `init.sh` sale verde a la primera con el baseline exacto.

La ronda 1 (arriba, íntegra) queda como historial. No se borra.

---

## D1 — Aserciones de `console.*` inertes → **CORREGIDO Y VERIFICADO**

`7f0873f` mueve los cinco `expect(errorSpies[i]).toHaveBeenCalledTimes(0)`
**dentro** del `try`, antes del `finally` que restaura. Estado final en
`wialon-http.client.spec.ts:534-538`, con el `finally` en 539-543.

**No me fié del reporte.** Verificación independiente ejecutada por mí:

1. Inyectado en `wialon-http.client.ts:135` (camino del re-login, dentro del
   `catch` de `callWithSession`, antes de `this.sid = null`):

   ```ts
   console.error('TEMP-REVIEW-LEAK relogin with token', this.token);
   ```

2. `pnpm exec jest src/integrations/wialon/wialon-http.client.spec.ts -t "R7"`
   → **2 failed, 21 skipped**. Los dos `it` de R7 caen:

   ```
   ● R7 … › no se loga ni se propaga en los errores de los caminos de R1, R4 y R5
     expect(jest.fn()).toHaveBeenCalledTimes(expected)
     Expected number of calls: 0
     Received number of calls: 2
     > 538 |       expect(errorSpies[3]).toHaveBeenCalledTimes(0);
     at Object.<anonymous> (integrations/wialon/wialon-http.client.spec.ts:538:29)
   ```

   ```
   ● R7 … › los archivos no introducen console.*, Logger ni @nestjs/common
     > 558 |     expect(clientSource).not.toMatch(/console\./);
     at Object.<anonymous> (integrations/wialon/wialon-http.client.spec.ts:558:30)
   ```

   Las **2** llamadas capturadas son las de `clientB` y `clientC`, los dos
   caminos del test que atraviesan el re-login. La guarda muerde, y muerde en
   el sitio exacto que R7 protege.

   Efecto colateral útil: el mismo experimento demuestra que el `it` de fuente
   (b) **también** ejecuta de verdad sus `not.toMatch` sobre un fuente no
   vacío. Los dos `it` de R7 son ahora guardas reales.

3. **Cambio temporal revertido y verificado limpio**:

   ```
   git checkout -- backend-pet-tracker/src/integrations/wialon/wialon-http.client.ts
   git hash-object …/wialon-http.client.ts
   antes:   908e10906a06d748867f06beab85c35115b3f474
   después: 908e10906a06d748867f06beab85c35115b3f474   ← idéntico
   grep -c TEMP-REVIEW-LEAK …/wialon-http.client.ts  →  0
   git status --short  →  solo los dos untracked de siempre
   ```

   El working tree quedó **exactamente** como estaba. Confirmado de nuevo tras
   `init.sh` completo (que corre `eslint --fix`): sin modificaciones.

Además, `expect(failureErrors).toHaveLength(2)` (línea 544, fuera del
`finally`) sigue presente: garantiza que los dos caminos de fallo se
ejercitaron de verdad y que las aserciones del bucle sobre `failureErrors` no
corrieron sobre una lista vacía. Anti-vacío correcto.

## D2 — Comentario borrado para poner verde el test → **CORREGIDO EN LA DIRECCIÓN CORRECTA**

Se tomó la opción 1 que proponía la ronda 1: restaurar el fuente y endurecer
la aserción.

**Fuente restaurado, byte a byte.** `2b28add` devuelve `wialon.errors.ts:1-2` a
su texto de `main`:

```
git show main:…/wialon.errors.ts | head -3
git show HEAD:…/wialon.errors.ts | head -3
→ idénticas:
  // Errores de dominio tipados de la integracion Wialon (R4) — sin
  // @nestjs/common, regla de docs/conventions.md §Manejo de errores. Nunca se
  // deja pasar un error crudo de HTTP/fetch al llamador.
```

`git diff main..HEAD -- …/wialon.errors.ts` es ahora **puramente aditivo**:
+14 líneas, **0 borradas**. La regresión de documentación desapareció.

**La aserción mira imports reales.** `7a90e1f`:

```diff
-    expect(clientSource).not.toContain('@nestjs/common');
-    expect(errorsSource).not.toContain('@nestjs/common');
+    expect(clientSource).not.toMatch(/from\s+['"]@nestjs\/common['"]/);
+    expect(errorsSource).not.toMatch(/from\s+['"]@nestjs\/common['"]/);
```

**¿Sigue pudiendo fallar?** Razonado sobre el patrón concreto
`/from\s+['"]@nestjs\/common['"]/`:

| Entrada | ¿Match? | ¿Correcto? |
|---|---|---|
| `import { Logger } from '@nestjs/common';` | **sí** → el test **falla** | sí, es lo que pide el leader |
| `import { Logger } from "@nestjs/common";` | sí (la clase `['"]` cubre ambas comillas) | sí |
| `import type { X } from '@nestjs/common';` | sí | sí |
| `} from` + salto de línea + `'@nestjs/common';` (multilínea de prettier) | sí (`\s+` incluye `\n`) | sí |
| `// … — sin @nestjs/common, regla de …` (el comentario) | **no** (no hay `from` + comilla delante) | sí, es justo el falso positivo que causó D2 |

La guarda pilla el caso que el leader pidió comprobar. Y el requisito la
respalda: `requirements.md:230` dice literalmente *"SHALL seguir sin
**importar** `@nestjs/common`"* — la aserción nueva está **más cerca** del
texto normativo que la vieja de subcadena, que confundía mención con import.

Techo conocido (no bloqueante, ver N4): no cubre `require('@nestjs/common')`
ni `import('@nestjs/common')` dinámico.

## C4 en la ronda de corrección — **rojo honesto, no fabricado**

Orden real de aplicación y contenido real de cada commit (`git show`):

| # | Commit | Prefijo | Archivo que toca de verdad | Efecto sobre R7(b) |
|---|---|---|---|---|
| 1 | `2b28add` | `test(` | `wialon.errors.ts` (**fuente**) | restaura el comentario ⇒ la aserción entonces vigente era `not.toContain('@nestjs/common')` y el fichero vuelve a contener esa subcadena ⇒ **ROJO** |
| 2 | `7a90e1f` | `feat(` | `wialon-http.client.spec.ts` (**test**) | cambia la aserción a la regex de import ⇒ **VERDE** |

El rojo es **real y honesto**: se produjo restaurando el artefacto a su estado
legítimo, no inventando un fallo. Es exactamente lo que `tasks.md` R7(2) pedía
("si algún `it` falla, hay una fuga real: quitarla… y reportarla") aplicado a
la contradicción que la ronda 1 identificó, y es la secuencia opuesta —
correcta — a la de `3e4dfd6`, donde el fuente se mutó para servir al test.

`7f0873f` (D1) no necesita fase roja propia: es la corrección de una aserción
inerte, y su capacidad de fallar la demostré yo con la inyección de arriba.

Observación de forma, no de fondo: **los prefijos van invertidos**. `2b28add`
lleva `test(` pero cambia fuente de producción; `7a90e1f` y `7f0873f` llevan
`feat(` pero cambian solo el fichero de test. Cosmético (ver N1).

## Que no se coló nada más

`git diff --name-only main..HEAD` → **13** archivos (el leader esperaba 12; el
decimotercero es `STATUS.md`, bookkeeping legítimo de la sesión). Ninguno
ajeno a la feature:

```
STATUS.md                                                  ← bookkeeping
feature_list.json                                          ← bookkeeping
progress/current.md                                        ← bookkeeping
progress/impl_wialon-session-reuse.md                      ← bookkeeping
docs/wialon-module.md                                      ← R9
specs/wialon-session-reuse/{requirements,design,tasks,traceability}.md
backend-pet-tracker/src/integrations/wialon/wialon-http.client.ts
backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts
backend-pet-tracker/src/integrations/wialon/wialon.errors.ts
backend-pet-tracker/src/workers/poller.service.spec.ts
```

- [x] **`.agents/`, `.codex/` y `skills-lock.json` fuera del diff** — `be18919`
      los destrackeó (O2 de la ronda 1, resuelto). `skills-lock.json` sigue
      untracked en el working tree; ruido de herramientas, ajeno a la feature.
- [x] **Ningún test preexistente editado.** Única línea borrada en los dos
      `.spec.ts` frente a `main`, igual que en la ronda 1:
      `-import { WialonApiError } from './wialon.errors';` (sustituida por el
      mismo import ampliado). Los cinco `it` del describe `R4:` de #8, intactos.
- [x] La ronda de corrección (`85bfecd..HEAD`) tocó **7** archivos: los 3 de
      `integrations/wialon/` + 4 de bookkeeping. **Ni `requirements.md`, ni
      `design.md`, ni `tasks.md`**: la spec aprobada no se movió para
      acomodar la corrección.

## R8 — La congelación sigue en pie

`git diff --name-only main..HEAD` sobre los ficheros congelados → **vacío**:

- [x] `fake-wialon.client.ts` y `fake-wialon.client.spec.ts` — sin tocar
- [x] `wialon-client.interface.ts` (el puerto) — sin tocar
- [x] `wialon.factory.ts` y `wialon.factory.spec.ts` (gate `SIM_MODE`) — sin tocar
- [x] `poller.service.ts` — sin tocar (solo su `.spec.ts`, para añadir R2)
- [x] `SIM_MODE`: la única aparición en el diff de código es la línea de JSDoc
      que `5ef90f8` retiró (un comentario obsoleto). El gate no se toca.

## `ddc87f0` — solo formato, sin semántica colada

Leído hunk por hunk. Las 9 modificaciones son re-envoltura de prettier:

- 3× `new WialonHttpClient(BASE_URL, 'real-token', fetchFn)` colapsado a una línea
- 4× `client.getMessages(…)` / `calls.filter(…)` expandido a multilínea
- 1× `expect(calls.filter(…)).toHaveLength(n)` reordenado a la forma multilínea
- 1× genérico de `callWithSession<{items?: …}>` reformateado en `listUnits()`

Ningún identificador, ningún literal, ninguna aserción, ningún argumento
cambia de valor ni de orden. **Sin cambio semántico.** Corroborado además por
el `eslint --fix` de `init.sh`, que no dejó modificaciones en el working tree.

## El reporte de impl ya no miente

`progress/impl_wialon-session-reuse.md` ahora registra los hechos:

- *"`R7` rojo bloqueado: se restauró el comentario de `wialon.errors.ts` a su
  texto original de main para no fabricar el fallo (commit `2b28add`)"*
- *"`R7` verde (D2): la aserción de `@nestjs/common` cambia a una regex de
  import real"*
- *"`R7` verde (D1): mover assert de `errorSpies` antes de `finally` … para
  que no quede inerte"*
- la verificación por inyección de `console.error(this.token)` y su retirada
- `ddc87f0` declarado como *"solo formato `eslint --fix` … sin cambios
  funcionales"*

La afirmación falsa de la ronda 1 se corrigió: *"(sin cambios de código)"* pasó
a *"(sin cambios de código **en ese bloque**)"*, y ese enunciado, acotado a R8,
es cierto. Queda una imprecisión menor de atribución (ver N2), no una mentira.
`progress/current.md` y `STATUS.md` describen la corrección con exactitud y
dejan constancia de que la feature **sigue `in_progress`** a la espera de esta
revisión.

---

## Checklist C2 — Estado coherente

- [x] Solo **1** feature `in_progress` en `feature_list.json` (#29). Codex **no**
      se auto-cerró esta vez: `git diff main..HEAD -- feature_list.json` muestra
      un único cambio, `"pending"` → `"in_progress"`
- [x] `progress/current.md` actualizado con la sección "Corrección tras revisión 1"
- [x] `STATUS.md` sincronizado (`init.sh` lo valida: "✅ STATUS.md sincronizado")

## Checklist C3 — Arquitectura

- [x] Todo el cambio vive en `src/integrations/wialon/` — infraestructura
- [x] `domain` sin imports de infrastructure — la feature no toca `domain`
- [x] Contratos en domain siguen siendo interfaces puras — `wialon-client.interface.ts` sin editar
- [x] `application` depende de interfaces — `poller.service.ts` sin editar
- [x] `infrastructure` sin lógica de negocio — `session()`/`callWithSession()` son gestión de sesión HTTP

La forma de `design.md` §D1 **no se degradó** en la ronda de corrección. Releído
`wialon-http.client.ts:115-147`; `5ef90f8` y `ddc87f0` solo tocaron imports,
JSDoc y formato de `listUnits()`. Las tres propiedades intactas:

- [x] `await this.session()` **fuera** del `try` (línea 127) ⇒ un `token/login`
      fallido nunca se reintenta (R5d)
- [x] El reintento llama a `this.call`, **no** a `callWithSession` (línea 137)
      ⇒ sin recursión, sin bucle
- [x] Solo `isInvalidSessionError` invalida el caché (líneas 131-136) ⇒ un
      `WialonTransportError` deja `sid`/`sidExpiresAtMs` intactos
- [x] Techo duro de **2 logins** por llamada pública, sin cambios
- [x] Caché por instancia (`private sid`, `private sidExpiresAtMs`), sin `static`

## Checklist C4 — TDD

- [x] Los **9** R-ids tienen `describe('R<n> (wialon-session-reuse #29): …')`:
      R1, R3, R4, R5, R6, R7, R8, R9 en `wialon-http.client.spec.ts`; R2 en
      `poller.service.spec.ts:248`
- [x] Historial rojo→verde por R-id para R1, R2, R3, R4, R6 y R9 (tabla ronda 1)
- [x] R5 y R8 nacen verdes — excepciones **declaradas por adelantado** en
      `traceability.md` §Excepciones
- [x] **R7 resuelto**: su mitad (b) tuvo rojo honesto en la ronda de corrección
      (`2b28add` → `7a90e1f`); su mitad (a) es hoy una guarda que **demostré**
      capaz de fallar

## Checklist C5 — Trazabilidad

- [x] `traceability.md` **sin ninguna fila "pendiente"** — las 9 rellenas con
      test + archivo + commit. La única aparición de la palabra es la frase de
      la regla ("el reviewer no aprueba si alguna fila queda 'pendiente'")
- [x] Cada R-id apunta a un test que **existe y de verdad lo prueba** — releídos
      uno a uno. R2 comprobado en detalle: 3 devices, `WialonHttpClient` real
      inyectado, `loginCalls` = 1, `messageCalls` = 3, todas con `sid-123`
- [x] La fila de R7 se actualizó con los cuatro commits de la corrección y los
      tres ficheros implicados
- [ ] Formato `feat(<scope>): <desc> (R-ids)` — arrastra lo de la ronda 1
      (`0ce9788`, `63c9b21`) y suma la inversión de prefijos de N1. Cosmético

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla `- [X] Aprobado por humano (fecha: 2026-08-17)` marcada (línea 377)
- [x] Las cuatro spec en `status: approved`
- [x] **Ningún requisito modificado después de la aprobación**:
      `git diff --name-only b5442bc..HEAD -- requirements.md design.md tasks.md`
      → vacío. Solo `traceability.md` evoluciona, que es su función
- [x] OD-1, OD-2 y OD-3 cerradas en el gate. **No reabiertas** en esta ronda:
      OD-3 (smoke con token real) no es condición de cierre y no se exige aquí

## Checklist C7 — Sin código huérfano

- [x] N/A — la feature no reemplaza ni deja obsoleto ningún componente. Cambio
      interno a `WialonHttpClient`; contrato público (`listUnits`,
      `getMessages`) idéntico, ningún consumidor cambia

---

## Observaciones no bloqueantes (ronda 2)

- **N1 — Prefijos de commit invertidos en la corrección.** `2b28add` es `test(`
  y toca fuente de producción; `7a90e1f`/`7f0873f` son `feat(` y tocan solo el
  test. La secuencia rojo→verde es honesta; solo las etiquetas engañan a quien
  lea `git log --oneline` sin abrir los diffs.
- **N2 — La atribución del error original quedó suave.** El reporte acota la
  frase a *"sin cambios de código **en ese bloque**"* en lugar de decir llanamente
  que `3e4dfd6` borró el comentario de `wialon.errors.ts`. El hecho es
  reconstruible (la línea de `2b28add` dice "se restauró … a su texto original
  de main"), así que ya no hay afirmación falsa, pero un lector futuro tiene que
  encadenar dos entradas para verlo.
- **N3 — `traceability.md` §Excepciones sigue clasificando R7 como "nace
  verde".** Tras la corrección, R7 tuvo un rojo real. La tabla quedó obsoleta
  *a favor* del rigor (declaró una excepción que al final no hizo falta), así
  que no engaña a nadie a la baja.
- **N4 — La regex de `@nestjs/common` no cubre `require()` ni `import()`
  dinámico.** Riesgo bajo en un backend TS con imports estáticos; cubre todas
  las formas de `import … from`. Endurecerla a `/@nestjs\/common/` a secas
  reintroduciría el falso positivo de los comentarios que causó D2.
- **N5 — Arrastradas de la ronda 1, sin agravar**: O4 (el JSDoc de
  `WIALON_SID_TTL_MS` sigue sin explicar *por qué* el margen es de un minuto;
  `tasks.md` R6(2), que es la lista operativa, sí queda satisfecha) y O5 (los
  27 commits tienen `%b` vacío).
- **O1, O2 y O3 de la ronda 1: RESUELTAS.** El JSDoc de la clase ya describe la
  forma real (`5ef90f8`), el import duplicado se unificó (`5ef90f8`), y los
  ~70 ficheros ajenos salieron del diff (`be18919`).

---

## Output de `./init.sh` — ejecutado por el reviewer

**Verde a la primera**, sin necesidad de `provision:local` (la infra estaba
caliente). Working tree limpio antes y después.

```
✅ node disponible  ✅ pnpm disponible  ✅ .env encontrado  ✅ DATABASE_URL definida
✅ Dependencias instaladas
✅ Archivos del harness presentes
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso

Test Suites: 139 passed, 139 total          (unit backend)
Tests:       1045 passed, 1045 total

Test Suites: 2 passed, 2 total              (unit infra)
Tests:       14 passed, 14 total
✅ Tests pasados

Test Suites: 2 skipped, 19 passed, 19 of 21 total    (e2e)
Tests:       6 skipped, 296 passed, 302 total
Time:        94.497 s
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 27/30 completadas | 2 pendientes

INIT_EXIT=0
```

Coincide **exactamente** con el baseline de hoy: 296 passed, 6 skipped, 19
suites, lint y typecheck limpios. **Sin regresiones.** El ruido de
`pet_users_user_id_users_id_fk` (`code: 23503`) aparece en el log de los e2e
pero ninguna suite falla: es la carrera de arranque conocida, no una regresión
de #29.

Nota frente a la ronda 1: aquellos 39 tests de la feature seguían verdes pero 5
aserciones pasaban incondicionalmente. **Hoy ya no**: lo verifiqué rompiéndolas
a propósito.

---

## Veredicto

**APROBADO.** Los dos bloqueantes están cerrados, verificados por el reviewer y
no por declaración; la corrección no degradó nada de lo aprobado en la ronda 1;
`init.sh` sale verde con el baseline exacto.

**Pendiente de cierre por el leader** (fuera del alcance del reviewer): marcar
#29 como `done` en `feature_list.json` y abrir el PR. El reviewer no toca
ninguna de las dos cosas.
