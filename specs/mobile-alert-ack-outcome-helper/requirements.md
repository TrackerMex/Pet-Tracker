---
feature: "mobile-alert-ack-outcome-helper"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-alert-ack-outcome-helper]] (#134)

> **Qué es.** El `switch` sobre el resultado de `ackAlert` está duplicado en
> `handleAck` de `src/screens/alerts/index.tsx` (centro, #78 R8) y en `handleAck`
> de `src/screens/alert-detail/index.tsx` (detalle, #100 R5). Esta feature saca
> la clasificación de las ramas comunes a una función de `src/utils/` y deja en
> cada pantalla solo lo que difiere: qué hace con `not-found` y dónde guarda el
> `Alert` de `ok`/`already-closed`. **Sin cambio de conducta** y **sin tocar la
> caché de `alertKeys.list()`** (#100 D2 y R5 la excluyen a propósito).
>
> Todas las rutas son relativas a `mobile-pet-tracker/` salvo que digan otra
> cosa. Diseño en `design.md`; orden de commits, mutaciones y anclas en
> `tasks.md`.

## Base de medición

Medida el 2026-10-09 en el worktree `Pet-Tracker-wt-134`, HEAD `13afb0b3`
(`origin/main` `fb1e562d` + un commit que solo toca `progress/current.md`).
Cada suite con `bunx jest <ruta>` desde `mobile-pet-tracker/`, **sin pipe**,
exit 0:

| Suite | Tests en la base | Tests al cerrar | Delta |
|---|---|---|---|
| `src/screens/alerts/index.test.tsx` | 39 | 41 | +2 (R1) |
| `src/screens/alert-detail/index.test.tsx` | 25 | 26 | +1 (R2) |
| `src/__tests__/design-drift.test.ts` | 62 | 65 | +3 (R6 ×2, R7 ×1) |
| `src/__tests__/ui-language.test.ts` | 30 | 30 | 0 |
| `src/utils/alert-ack-outcome.test.ts` | no existe | 15 | suite nueva (R3 ×3, R4 ×7, R5 ×5) |

Total: **+21 tests y +1 suite**. Los recuentos son de esta base; si otra
feature mergea antes, lo que vale es el **delta**, no el total (ver
`design.md` §6). Las anclas de contenido (valores antes y después) están en
`tasks.md` §Anclas; **ninguna ancla es un número de línea**.

Codex re-mide al arrancar las cinco filas de esta tabla y las anclas «antes» de
`tasks.md` §Anclas. Si alguna difiere, **para** y lo escribe en
`progress/impl_mobile-alert-ack-outcome-helper.md` antes de tocar nada.

## Literales normativos

El helper y los tests nuevos usan exactamente estas cadenas del catálogo
(`src/i18n/catalog.ts`, sin cambios en esta feature):

| Clave | en | es |
|---|---|---|
| `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
| `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |

Los tests nuevos asertan **el literal escrito**, nunca `en[...]`/`es[...]`
(un literal importado de producción no detecta una clave cambiada).

## Vocabulario

- **Rama**: cada valor de `kind` de `AckAlertState` (`src/api/alerts.ts`):
  `ok`, `already-closed`, `not-found`, `unreachable`, `unauthorized`, `error`,
  `missing-config`; más dos ramas de excepción: **catch** (la petición rechaza)
  y **signOut rechaza** (tras `unauthorized`).
- **Ramas delegadas**: `ok`, `already-closed`, `not-found` — el helper las
  clasifica pero el efecto lo pone cada pantalla.
- **Ramas comunes**: `unreachable`, `unauthorized`, `error`, `missing-config`,
  catch, signOut rechaza — el helper las resuelve entero.
- **Helper**: `settleAlertAck` en `src/utils/alert-ack-outcome.ts`; firma
  cerrada en `design.md` §2.

## Requisitos funcionales

### R1 — El centro de alertas conserva la conducta del ack

**EARS:** WHEN el usuario pulsa el botón de marcar leída de una fila
(`alert-row-<id>-ack`) en `src/screens/alerts/index.tsx` y `ackAlert` termina
en una rama, THE SYSTEM SHALL producir el efecto de la tabla siguiente, antes
y después del refactor de R6.

| Rama | Efecto observable en el centro | Candado |
|---|---|---|
| ok | la fila toma el `Alert` devuelto y pierde el botón | existente: «aplica el Alert devuelto por ok y quita el botón» |
| already-closed | la fila muestra la píldora resuelta | existente: «convierte already-closed en la píldora resuelta» |
| not-found | la fila se conserva y `alerts-action-error` muestra `Algo salió mal`; se limpia al reintentar | existente: «mantiene la fila en not-found, muestra el error y lo limpia al reintentar» |
| unreachable | `alerts-action-error` muestra `No se pudo conectar con el servidor` | existente: «traduce unreachable como servidor inalcanzable» |
| unauthorized | `signOut` una vez y sin error pintado | existente: «cierra sesión en unauthorized sin pintar error (#72 R2)» |
| error | `alerts-action-error` muestra `Algo salió mal` | existente: it.each «traduce $kind como error genérico» |
| missing-config | `alerts-action-error` muestra `Algo salió mal` | existente: it.each «traduce $kind como error genérico» |
| catch | `ackAlert` rechaza: `alerts-action-error` muestra `Algo salió mal` | **nuevo C1** |
| signOut rechaza | `unauthorized` y `signOut` rechaza: `alerts-action-error` muestra `Algo salió mal`, `signOut` una vez | **nuevo C2** |

Los tests existentes viven en `describe('#78 R8: el ack cambia la fila sin
recargar la lista')` de `src/screens/alerts/index.test.tsx`. C1 y C2 son
**tests de caracterización**: verdes sobre el código de la base, cerrados por
una mutación de producción que los pone rojos **por aserción** (`tasks.md` §R1).

### R2 — El detalle de alerta conserva la conducta del ack

**EARS:** WHEN el usuario pulsa `alert-detail-ack` en
`src/screens/alert-detail/index.tsx` y `ackAlert` termina en una rama, THE
SYSTEM SHALL producir el efecto de la tabla siguiente, antes y después del
refactor de R6.

| Rama | Efecto observable en el detalle | Candado |
|---|---|---|
| ok | el detalle toma el `Alert` devuelto y retira el botón | existente: «marca leída una vez y retira el botón» |
| already-closed | `alert-detail-status` muestra Resuelta | existente: «muestra Resuelta si el servidor responde already-closed» |
| not-found | `router.dismissTo('/alerts')` una sola vez y sin error pintado | existente: «sale una sola vez si el servidor responde not-found» |
| unreachable | `alert-detail-action-error` muestra `No se pudo conectar con el servidor` | existente: it.each «muestra el error de $kind sin borrar la tarjeta» |
| unauthorized | `signOut` una vez y sin error pintado | existente: «cierra sesión una vez si el ack responde unauthorized» |
| error | `alert-detail-action-error` muestra `Algo salió mal` | existente: it.each «muestra el error de $kind…» |
| missing-config | `alert-detail-action-error` muestra `Algo salió mal` | existente: it.each «muestra el error de $kind…» |
| catch | `ackAlert` rechaza: `Algo salió mal` | existente: it.each fila `'rejected'` |
| signOut rechaza | `unauthorized` y `signOut` rechaza: `alert-detail-action-error` muestra `Algo salió mal`, `signOut` una vez | **nuevo D1** |

Los tests existentes viven en `describe('#100 R5: el detalle marca leída la
alerta')` de `src/screens/alert-detail/index.test.tsx`. D1 es de
caracterización, como C1 y C2.

**Candado de R1 y R2 sobre lo existente:** ningún test existente de las dos
suites cambia. `git diff --numstat <H0> -- src/screens/alerts/index.test.tsx
src/screens/alert-detail/index.test.tsx` muestra **0** en la columna de
borrados de ambos ficheros (H0 = HEAD del handoff).

### R3 — El helper entrega las ramas delegadas a la pantalla

**EARS:**
- WHEN la petición que recibe `settleAlertAck` resuelve `{ kind: 'ok', alert:
  next }`, THE SYSTEM SHALL llamar `onAcked` una vez con **esa misma
  referencia** `next`, y no llamar `showError`, `signOut` ni `onNotFound`.
- WHEN resuelve `{ kind: 'already-closed' }`, THE SYSTEM SHALL llamar
  `onAcked` una vez con un objeto **nuevo** igual a `{ ...alert, status:
  'closed' }` (el `alert` recibido conserva su `status`), y no llamar
  `showError`, `signOut` ni `onNotFound`.
- WHEN resuelve `{ kind: 'not-found' }`, THE SYSTEM SHALL llamar `onNotFound`
  una vez sin argumentos, y no llamar `showError`, `signOut` ni `onAcked`.

Prueba: 3 tests en `src/utils/alert-ack-outcome.test.ts`,
`describe('#134 R3: …')`.

### R4 — El helper resuelve las ramas comunes en los dos idiomas

**EARS:**
- WHEN la petición resuelve `{ kind: 'unreachable', message }` (cualquier
  `message`), THE SYSTEM SHALL llamar `showError` una vez con
  `t('common.cannotReachServer')` — `Cannot reach server` en en, `No se pudo
  conectar con el servidor` en es — y no llamar `signOut`, `onAcked` ni
  `onNotFound`. El `message` del servidor no se muestra (conducta de la base).
- WHEN resuelve `{ kind: 'unauthorized' }`, THE SYSTEM SHALL esperar
  (`await`) a `signOut()`, llamarlo una vez, y no llamar `showError`,
  `onAcked` ni `onNotFound`.
- WHEN resuelve `{ kind: 'error' }` o `{ kind: 'missing-config' }`, THE SYSTEM
  SHALL llamar `showError` una vez con `t('common.somethingWentWrong')` —
  `Something went wrong` en en, `Algo salió mal` en es — y no llamar
  `signOut`, `onAcked` ni `onNotFound`.

Prueba: 7 tests en `describe('#134 R4: …')` — unreachable ×2 idiomas,
unauthorized ×1, error ×2 idiomas, missing-config ×2 idiomas. Un candado por
rama **y** por idioma.

### R5 — El helper convierte toda excepción en el error genérico y nunca rechaza

**EARS:** IF `request()` rechaza, OR `request()` lanza de forma síncrona, OR
`signOut()` rechaza tras `unauthorized`, THEN THE SYSTEM SHALL llamar
`showError` una vez con `t('common.somethingWentWrong')` (`Something went
wrong` / `Algo salió mal`), no llamar `onAcked` ni `onNotFound`, y la promesa
que devuelve `settleAlertAck` SHALL resolver a `undefined` (no rechaza).

Prueba: 5 tests en `describe('#134 R5: …')` — rechazo en/es, lanzamiento
síncrono es, signOut rechaza en/es. Un candado por cada una de las tres
condiciones.

### R6 — Un solo sitio clasifica el resultado del ack

**EARS:** THE SYSTEM SHALL clasificar el resultado de `ackAlert` solo en
`src/utils/alert-ack-outcome.ts`: en cada una de
`src/screens/alerts/index.tsx` y `src/screens/alert-detail/index.tsx`, el
fuente contiene **0** `case '`, **0** `t('common.cannotReachServer')`, **0**
`signOut(`, **1** `settleAlertAck(` y **1** `ackAlert(baseUrl`.

Además, los inventarios globales reflejan el movimiento **en el mismo commit
rojo** (detalle y anclas en `design.md` §5 y `tasks.md` §R6):

| Candado global | Fichero | Efecto de #134 |
|---|---|---|
| `screenSignOutCalls` (#87 R19) | `src/__tests__/design-drift.test.ts` | `screens/alerts/index.tsx` 1→0 (−1); `screens/alert-detail/index.tsx` 1→0 (−1); entrada nueva `utils/alert-ack-outcome.ts: 1` (+1). Neto **−1** |
| `R12_ALERTS` (#78 R12) | `src/__tests__/ui-copy-table.ts` | −2 filas centro `common.somethingWentWrong`; −1 fila centro `common.cannotReachServer`; +1 fila helper `common.cannotReachServer`; +2 filas helper `common.somethingWentWrong`. Neto **0** |
| predicado de fichero de #78 R12 | `src/__tests__/ui-language.test.ts` | admite `src/utils/alert-ack-outcome.ts` |
| `R13_ALERT_DETAIL` (#100 R10) | `src/__tests__/ui-copy-table.ts` + `ui-language.test.ts` | −2 filas detalle `common.somethingWentWrong`; −1 fila detalle `common.cannotReachServer`. Longitud `11 - 3` (**−3**) |
| `ALL_USES` | `src/__tests__/ui-copy-table.ts` | **−3** (suma de las dos filas anteriores; se recalcula sola) |
| `SCREEN_FILES` (#65 R18) | `src/__tests__/ui-language.test.ts` | **+1** (entra `src/utils/alert-ack-outcome.ts`) |
| claves del catálogo (`language-provider.test.tsx`) | — | **sin cambio**: no hay claves nuevas ni borradas |

Prueba: `describe('#134 R6: …')` nuevo al final de
`src/__tests__/design-drift.test.ts` (it.each con las dos pantallas) más los
candados existentes de la tabla con sus valores nuevos.

### R7 — El ack no toca la caché de la lista

**EARS:** THE SYSTEM SHALL NOT invalidar ni escribir la caché de
`alertKeys.list()` desde el ack: la expresión
`/alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient/` tiene
**0** coincidencias en `src/utils/alert-ack-outcome.ts`,
`src/screens/alerts/index.tsx` y `src/screens/alert-detail/index.tsx`.

Es un requisito de verificación (C4 b): el test nace verde y se cierra con la
mutación de `tasks.md` §R7. Prueba: `describe('#134 R7: …')` al final de
`src/__tests__/design-drift.test.ts`.

## Criterios de cierre (no son R-id)

1. Suite móvil completa verde, medida **sin pipe** (`bunx jest` desde
   `mobile-pet-tracker/`, exit 0), con los totales de la tabla de la base más
   los deltas.
2. `bun run typecheck` y `bunx expo lint --no-cache` con exit 0 y salida sin
   avisos ni errores.
3. El `numstat` de R1/R2 con 0 borrados en las dos suites de pantalla.
4. `src/i18n/catalog.ts` y `src/__tests__/language-provider.test.tsx` sin
   diff respecto a H0.

## Fuera de alcance

Delimitaciones (no son features pendientes):

- **Invalidar o escribir `alertKeys.list()` tras el ack.** Excluido por #100 D2
  y R5; R7 lo cierra con un candado.
- **Las otras cadenas de error de las pantallas**: `laterPageFailed` y
  `alerts-error` del centro, y el error de carga del detalle, siguen en su
  pantalla con su `t('common.somethingWentWrong')`. No son del ack.
- **El guard de doble pulsación y el `finally`** (`ackingIdRef`/`setAckingId`
  en el centro, `ackingRef`/`setAcking` en el detalle) siguen en cada pantalla:
  uno es por id y el otro único.
- **`setActionError(null)` al empezar** sigue en cada pantalla.
- **La conducta de `not-found`** no cambia: el centro conserva la fila y pinta
  `Algo salió mal`; el detalle sale a `/alerts` una sola vez.
- **Mostrar el `message` de `unreachable`**: se sigue ignorando.
- **`src/api/alerts.ts` y `AckAlertState`**: sin cambios.
- **Copy y catálogo**: sin claves nuevas, sin textos cambiados.
- **Smoke humano en dev build de Android**: no se pide (refactor sin cambio
  visual ni nativo; ver Q5).

## Preguntas abiertas

- **Q1.** ¿Se cierra con candado que un rechazo de `signOut` tras `unauthorized` pinta
  `Algo salió mal` en las dos pantallas (C2, D1, R5)? Es la conducta de la base
  y ningún test la fija hoy. **Recomendación: sí**, porque el refactor mueve
  justo ese `await` al helper.
- **Q2.** ¿Las filas del helper van en `R12_ALERTS` o en un bloque nuevo?
  **Recomendación: `R12_ALERTS`**, con el precedente de `src/utils/alert-meta.ts`
  (#100 R3); un bloque nuevo obliga a tocar `ALL_USES` y su test de suma.
- **Q3.** ¿El helper entra en `screenSignOutCalls` con 1? **Recomendación:
  sí**; así el mapa sigue contando cada `signOut(` de mutación y el −1 neto
  queda explicado, no perdido.
- **Q4.** ¿R7 es un requisito propio o una fila de R6? **Recomendación:
  propio**: es el límite firme de la feature y tiene su mutación aparte.
- **Q5.** ¿Hace falta smoke en dev build de Android? **Recomendación: no**; no
  cambia nada visible ni nativo y las nueve ramas quedan candadas en las dos
  pantallas.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
