---
feature: "mobile-alert-ack-outcome-helper"
status: approved     # draft | approved
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

## Enmienda E1 — la espera a `signOut` y el idioma de cada pantalla (2026-10-09)

**Qué paró.** El reviewer rechazó la ronda 1
(`progress/review_mobile-alert-ack-outcome-helper.md`, commit `815de8f6`). El
código de HEAD (`b276727e`) es correcto y sigue `design.md` al pie de la
letra. Lo que falla es que dos cláusulas no tienen candado en alguna de sus
ramas. Las dos vienen de la lista de tests que prescribía esta spec, no de
una desviación de Codex:

| Bloqueante | Cláusula | Sondas que sobreviven |
|---|---|---|
| B1 | R4: «esperar (`await`) a `signOut()`» | P3c y P3d: `await signOut()` sustituido por un `void … .catch(…)` que no espera deja helper (15/15), centro (41/41) y detalle (26/26) en verde |
| B2 | `design.md` §3, fila `t`: cada pantalla pasa «`t` de `useTranslate()`» | P11 (detalle) y P14 (centro): un `t` fijado a `es` deja en verde la pantalla, `ui-language` y `design-drift`. Las dos suites de pantalla solo prueban el ack en `es` |
| B3 | `design.md` §3, fila `signOut`: cada pantalla pasa «`signOut` de `useAuth()`, pasado sin llamarlo» | Q6Bc y Q6Bd (pre-verificación de E1, F3): un envoltorio de `signOut` que no espera y esconde los literales `signOut(` y `t('…')` deja en verde la pantalla, `ui-language` y `design-drift`. El `finally` de la pantalla corre antes de que `signOut` termine: la conducta de B1, vista desde la pantalla |

Antes del rechazo, `checkUses` contaba los `t('…')` de cada pantalla. #134 los
movió al helper, y desde entonces nada mira qué `t` le pasa cada pantalla.

**Barrido exhaustivo (ronda 1).** Antes de esta enmienda, el reviewer sondeó
cada cláusula de R1–R7 y de `design.md` §2/§3: 30 sondas
(`progress/review_mobile-alert-ack-outcome-helper.md` §Barrido exhaustivo).
De #134 solo sobrevivió P14, que es la mitad de B2 en el centro. Las otras
siete supervivientes son anteriores a #134 (ver E1.5).

**Decisión del humano (2026-10-09): solo lo de #134.** E1 cierra B1 y B2. Las
siete supervivientes anteriores pasan a deuda con sus límites exactos (E1.5).

**Pre-verificación de E1** (mismo fichero de review, §Pre-verificación E1).
El reviewer escribió los tests de E1 tal cual, aplicó sus mutaciones y sondas,
y barrió sus cláusulas. De ahí salen dos cambios:

- **F1**: el segundo argumento de `done.then` en W1 y W2 (E1.1, paso 2).
- **F3**: la fila hermana de B2, que es B3. Nace de #134 igual que B1 y B2, así
  que entra por la misma decisión del humano. La cierra E1.7, que está medida
  en el spike F3.

Q1 (una espera a `signOut` acotada por un temporizador) queda sin candado: no
es una rama de la cláusula, y ningún test finito la cierra (F2).

E1 **no toca código de producción**. Todos los candados nacen en verde contra
HEAD, porque el código ya cumple. Su rojo se demuestra con la mutación de su
commit rojo y con las sondas de E1.4, igual que R1, R2 y R7.

### E1.1 — R4: el helper espera a `signOut`, resuelva o rechace

Dos `it` nuevos al final de `describe('#134 R4: el helper resuelve las ramas
comunes en los dos idiomas')`, en `src/utils/alert-ack-outcome.test.ts`. Uno
cubre cada rama de la espera: `signOut` resuelve, o `signOut` rechaza.

Dos funciones nuevas a nivel de módulo, justo después de `makeHandlers`:

```ts
function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

function flushPromises() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}
```

**W1**, `it('unauthorized espera a signOut antes de resolver')`:

1. `makeHandlers('es')`, y `handlers.signOut.mockReturnValueOnce(signOutGate.promise)`
   con `const signOutGate = deferred()`.
2. `const done = settleAlertAck(() => Promise.resolve({ kind: 'unauthorized' }), alert, handlers);`,
   `let settled = false;` y, con el segundo argumento obligatorio:

   ```ts
   void done.then(
     () => {
       settled = true;
     },
     () => undefined,
   );
   ```

   Sin `() => undefined`, una mutación que haga rechazar a `settleAlertAck`
   deja la promesa derivada sin manejar y Node tumba el proceso de jest: se
   pierde el informe de todo el fichero, y los rojos por aserción que hoy dan
   los `it` de R5 pasan a ser una caída (pre-verificación E1, F1: sondas Q2
   `return signOut();` y Q7 `catch` que relanza).
3. `await flushPromises();`. Después, `signOut` llamado una vez y
   `expect(settled).toBe(false)`.
4. `signOutGate.resolve();` y `await expect(done).resolves.toBeUndefined();`.
   Después, `expect(settled).toBe(true)`, y `showError`, `onAcked` y
   `onNotFound` sin llamadas.

**W2**, `it('unauthorized espera también a un signOut que rechaza, es')`:

1. Los pasos 1 y 2 de W1.
2. `await flushPromises();`. Después, `signOut` llamado una vez,
   `expect(settled).toBe(false)` y `showError` sin llamadas.
3. `signOutGate.reject(new Error('sign-out failed'));` y
   `await expect(done).resolves.toBeUndefined();`. Después,
   `expect(settled).toBe(true)`, `showError` llamado una vez con el literal
   `'Algo salió mal'`, y `onAcked` y `onNotFound` sin llamadas.

El idioma del texto ya lo cierran los cinco `it` de R5. La espera no depende
del idioma, así que W1 y W2 van en `es`.

**Mutación M5** del commit rojo, en `src/utils/alert-ack-outcome.ts`. Son tres
cambios que dejan los recuentos de `checkUses` igual (2
`t('common.somethingWentWrong')`, 1 `signOut(`):

1. Primera línea del cuerpo de `settleAlertAck`, antes de `try {`:
   `const fail = () => showError(t('common.somethingWentWrong'));`
2. En `case 'unauthorized':`, `await signOut();` pasa a
   `void Promise.resolve(signOut()).catch(fail);`
3. En el `catch`, `showError(t('common.somethingWentWrong'));` pasa a `fail();`

Con M5, solo W1 y W2 caen, los dos en `expect(settled).toBe(false)`. Los 15
`it` anteriores siguen verdes, porque P3d, que es equivalente, ya los dejaba
verdes.

### E1.2 — R1 y R2: cada pantalla pinta el error del ack en inglés

Las tablas de R1 y R2 suman dos filas cada una. El literal de cada fila es el
de §Literales normativos en `en`:

| Pantalla | Rama | Efecto | Candado |
|---|---|---|---|
| centro | unreachable (en) | `alerts-action-error` muestra `Cannot reach server` | **nuevo C3** |
| centro | error (en) | `alerts-action-error` muestra `Something went wrong` | **nuevo C4** |
| detalle | unreachable (en) | `alert-detail-action-error` muestra `Cannot reach server` | **nuevo D2** |
| detalle | error (en) | `alert-detail-action-error` muestra `Something went wrong` | **nuevo D3** |

Una fila por cada una de las dos claves que traduce el helper con el `t` de
la pantalla. Los `it` en `es` de cada clave ya existen en las dos suites.

**Centro**, `src/screens/alerts/index.test.tsx`:

- Dos funciones nuevas, justo después de `function renderAlerts() {…}`.
  `AlertsWrapper` y `renderAlerts` fijan `initial="es"` y **no se tocan**,
  porque el candado de R1/R2 exige 0 borrados:

  ```tsx
  function EnglishAlertsWrapper({ children }: { children: ReactNode }) {
    return (
      <HeroUINativeProvider>
        <LanguageProvider initial="en">{children}</LanguageProvider>
      </HeroUINativeProvider>
    );
  }

  function renderAlertsInEnglish() {
    return renderWithProviders(<AlertsScreen />, {
      wrapper: EnglishAlertsWrapper,
    });
  }
  ```

- Dos `it` al final de `describe('#134 R1: caracterización de las ramas sin
  candado del ack')`:
  - C3: `it('muestra Cannot reach server en inglés si ackAlert responde unreachable')`.
    Usa `mockAckAlert.mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' })`.
  - C4: `it('muestra Something went wrong en inglés si ackAlert responde error')`.
    Usa `mockAckAlert.mockResolvedValueOnce({ kind: 'error' })`.
  - Cuerpo común:
    1. `await renderAlertsInEnglish();`
    2. `await fireEvent.press(await screen.findByTestId('alert-row-alert-1-ack'));`
    3. `await waitFor(() => expect(screen.queryByTestId('alerts-action-error')).toHaveTextContent('<literal>'));`

**Detalle**, `src/screens/alert-detail/index.test.tsx`: dos `it` al final de
`describe('#134 R2: caracterización de la rama sin candado del ack')`, con los
mismos títulos y los mismos `mockResolvedValueOnce` que C3 y C4:

- D2: `unreachable`, `'Cannot reach server'`.
- D3: `error`, `'Something went wrong'`.

Cuerpo común, sin funciones nuevas:

1. `await renderDetail('alert-1', 'en');`
2. `await fireEvent.press(await screen.findByTestId('alert-detail-ack'));`
3. `await waitFor(() => expect(screen.queryByTestId('alert-detail-action-error')).toHaveTextContent('<literal>'));`

Esperas: según `docs/conventions.md` §Esperas sobre el árbol renderizado,
cada `it` espera al texto del nodo de error y no a un contador de mock.
`queryByTestId` dentro del `waitFor` hace que el rojo sea por aserción: el
nodo existe y pinta el texto en `es`.

**Mutación M6** del commit rojo de R1, en `src/screens/alerts/index.tsx`:

- `import { es } from '../../i18n/catalog';` justo después de la línea
  `import { useAlertsList } from '../../hooks/use-alerts-list';`;
- en el tercer argumento de `settleAlertAck`, la línea `t,` pasa a
  `t: (key) => es[key],`.

**Mutación M7** del commit rojo de R2: la misma, en
`src/screens/alert-detail/index.tsx`.

Con M6, solo C3 y C4 caen. Con M7, solo D2 y D3. El resto de la suite sigue
verde: P14 y P11, que son la misma mutación, dejaban verdes la pantalla,
`ui-language` y `design-drift`.

### E1.3 — Cuentas

Base medida por el reviewer en HEAD `b276727e`, que es igual en `src/` a
`815de8f6`:

| Suite | Antes de E1 | Después de E1 | Delta |
|---|---|---|---|
| `src/utils/alert-ack-outcome.test.ts` | 15 | 17 | +2 (W1, W2) |
| `src/screens/alerts/index.test.tsx` | 41 | 44 | +3 (C3, C4, C5) |
| `src/screens/alert-detail/index.test.tsx` | 26 | 29 | +3 (D2, D3, D4) |
| `src/__tests__/design-drift.test.ts` | 65 | 65 | 0 |
| `src/__tests__/ui-language.test.ts` | 30 | 30 | 0 |

La suite móvil completa pasa de 98 suites y 2386 tests a 98 suites y
**2394** tests (+8). Respecto a la base original de la spec (H0 de la ronda
1), el total de #134 es **+29 tests y +1 suite**.

No cambia ninguna fila de `ui-copy-table.ts`, ningún recuento de
`ui-language.test.ts`, `screenSignOutCalls` ni la longitud del catálogo. Los
literales nuevos van en tests, y `checkUses` solo cuenta fuente.

### E1.4 — Sondas

Cada sonda se aplica sobre el HEAD de la ronda 2 ya cerrado. Se mide con jest
acotado a su fichero, se revierte con `git checkout HEAD -- <fichero>` y se
comprueba `git diff --quiet && git diff --cached --quiet`. Todas dan **rojo
por aserción**, nunca por consulta. Ninguna se commitea; cada una se apunta
en el impl con su salida roja recortada (el `●` del `it` y la línea del
matcher).

| Id | Fichero de producción | Mutación | Rojo esperado |
|---|---|---|---|
| E1-S1 | `src/utils/alert-ack-outcome.ts` | `await signOut();` pasa a `void Promise.resolve(signOut()).catch(() => showError(t('common.somethingWentWrong')));` (P3d) | W1 y W2, `toBe(false)` |
| E1-S2 | `src/utils/alert-ack-outcome.ts` | `await signOut();` pasa a `void signOut().catch(() => showError(t('common.somethingWentWrong')));` (P3c) | W1 y W2, `toBe(false)` |
| E1-S3 | `src/screens/alerts/index.tsx` | el `import { es }` de M6, y `t,` pasa a `t: (key) => (key === 'common.cannotReachServer' ? es[key] : t(key)),` | solo C3, `toHaveTextContent` |
| E1-S4 | `src/screens/alerts/index.tsx` | lo mismo con `'common.somethingWentWrong'` | solo C4, `toHaveTextContent` |
| E1-S5 | `src/screens/alert-detail/index.tsx` | lo de E1-S3, en el detalle | solo D2, `toHaveTextContent` |
| E1-S6 | `src/screens/alert-detail/index.tsx` | lo de E1-S4, en el detalle | solo D3, `toHaveTextContent` |

| E1-S7 | `src/screens/alerts/index.tsx` | M8 de E1.7 sola | solo C5, `toBeDisabled` |
| E1-S8 | `src/screens/alert-detail/index.tsx` | M9 de E1.7 sola | solo D4, `toBeDisabled` |

E1-S3 a E1-S6 fijan **una sola** clave cada una. Así cada `it` es el candado
de su clave, y no un candado compartido. E1-S7 y E1-S8 aplican por separado
las dos mitades del commit rojo de E1.7: cada pantalla tiene su propio
candado.

### E1.5 — Qué no cambia, y deuda

- **Producción.** `git diff --quiet <H0 de la ronda 2> HEAD -- src/utils/alert-ack-outcome.ts src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx`
  da exit 0. Las mutaciones M5 a M9 se revierten en su verde.
- **Tests existentes.** `git diff --numstat <H0 de la ronda 2> HEAD` sobre los
  tres ficheros de test da 0 en la columna de borrados. No cambia ningún `it`
  de la ronda 1.
- **Inventarios, catálogo y dependencias.** `ui-copy-table.ts`,
  `ui-language.test.ts`, `design-drift.test.ts`, `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx`, `package.json` y
  `bun.lock` no tienen diff.
- **Deuda: siete supervivientes anteriores a #134.** Están en líneas que #134
  no modifica: `git diff -U0` desde el H0 de la ronda 1 no toca en las
  pantallas ni el guard, ni el `finally`, ni `setActionError(null)`, ni el
  bloque de `leavingRef`. Sus límites son exactamente los de la tabla «Origen
  de cada superviviente» del barrido. Son delimitación de #134, no
  incumplimiento. El leader las registra como feature pendiente de deuda al
  cerrar #134:

  | Sonda | Pantalla | Línea que sobrevive a su borrado o cambio | Escenario sin candado |
  |---|---|---|---|
  | P16b | detalle | `setActionError(null)` al empezar `handleAck` | reintento tras un error |
  | P20a | detalle | `ackingRef.current = false;` en el `finally` | reintento tras un error |
  | P20b | detalle | `setAcking(false);` en el `finally` | reintento tras un error |
  | P17 | centro | `if (ackingIdRef.current !== null) return;` | dos pulsaciones antes del re-render |
  | P18 | detalle | `\|\| ackingRef.current` del guard | dos pulsaciones antes del re-render |
  | P24 | detalle | `leavingRef.current = true` en `onNotFound` | not-found y luego la lista pierde la alerta |
  | P25 | detalle | la comprobación de `leavingRef` en `onNotFound` | la lista pierde la alerta con el ack en vuelo y luego not-found |

### E1.6 — Riesgo

**Si un candado no da verde contra HEAD, o una mutación no da el rojo
declarado, Codex PARA.** Copia el `Received` recortado al impl, no toca
producción fuera de la mutación declarada y no ajusta el `it`. Quien decide
es el leader.

### E1.7 — R1 y R2: cada pantalla espera a `signOut` (B3)

Las tablas de R1 y R2 suman una fila cada una:

| Pantalla | Rama | Efecto | Candado |
|---|---|---|---|
| centro | unauthorized, con `signOut` pendiente | `alert-row-alert-1-ack` sigue deshabilitado hasta que `signOut` termina; después se habilita, sin error pintado | **nuevo C5** |
| detalle | unauthorized, con `signOut` pendiente | `alert-detail-ack` sigue deshabilitado hasta que `signOut` termina; después se habilita, sin error pintado | **nuevo D4** |

La rama en la que `signOut` rechaza no necesita otro `it` en pantalla. Un
envoltorio que no espera solo puede propagar el rechazo pintando su propia
copia, y esa copia ya la miran C2, D1 y `checkUses`.

**C5**, en `src/screens/alerts/index.test.tsx`: se inserta justo antes del
`  });` que cierra `describe('#134 R1: caracterización de las ramas sin
candado del ack')`, después de C4. Son 19 líneas, con la línea en blanco
inicial incluida:

```tsx

    it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized', async () => {
      let finishSignOut: () => void = () => undefined;
      mockAckAlert.mockResolvedValueOnce({ kind: 'unauthorized' });
      mockSignOut.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishSignOut = resolve;
        }),
      );

      await pressAck();

      await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
      expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled();

      finishSignOut();
      await waitFor(() => expect(screen.getByTestId('alert-row-alert-1-ack')).not.toBeDisabled());
      expect(screen.queryByTestId('alerts-action-error')).toBeNull();
    });
```

**D4**, en `src/screens/alert-detail/index.test.tsx`: se inserta justo antes
del `  });` que cierra `describe('#134 R2: caracterización de la rama sin
candado del ack')`, después de D3. Son 20 líneas, con la línea en blanco
inicial incluida. No añade imports: `fireEvent`, `screen` y `waitFor` ya están
importados.

```tsx

    it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized', async () => {
      let finishSignOut: () => void = () => undefined;
      mockAckAlert.mockResolvedValueOnce({ kind: 'unauthorized' });
      mockSignOut.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishSignOut = resolve;
        }),
      );

      await renderDetail();
      await fireEvent.press(await screen.findByTestId('alert-detail-ack'));

      await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
      expect(screen.getByTestId('alert-detail-ack')).toBeDisabled();

      finishSignOut();
      await waitFor(() => expect(screen.getByTestId('alert-detail-ack')).not.toBeDisabled());
      expect(screen.queryByTestId('alert-detail-action-error')).toBeNull();
    });
```

**Reglas de este texto:**

- El diferido se declara con inicializador (`= () => undefined`) y no con
  `!`. La forma con `!` no está medida contra lint ni typecheck.
- No se añade `act` ni ningún vaciado explícito, y ningún import cambia. El
  detalle no importa `act`, y una segunda línea de import de
  `@testing-library/react-native` dispara `import/no-duplicates`.

**§Esperas.** La espera al contador de `signOut` seguida de la consulta del
botón no abre carrera aquí:

- En HEAD, `isDisabled` pasa a `true` dentro del `act` de la pulsación, y solo
  vuelve a `false` en el `finally` de la pantalla.
- Ese `finally` solo corre cuando el test llama `finishSignOut()`, que va
  después de la aserción.
- La espera no aguarda a que se pinte nada: sitúa la aserción en la ventana
  «`signOut` pendiente» y no en la ventana «ack en vuelo», donde el botón
  también está deshabilitado.
- El paso final espera sobre el árbol (`not.toBeDisabled()`) y después
  comprueba la ausencia con `queryByTestId`.

**Mutaciones M8 (centro) y M9 (detalle)** del commit rojo: un solo commit
añade C5 y D4 y aplica las dos a la vez. Cada una sustituye el `signOut` que
la pantalla pasa al helper por un envoltorio que no espera y que esconde los
literales que miran `design-drift` y `checkUses`:

Las dos sustituyen una sola línea, `        signOut,` (8 espacios), del objeto
de handlers que recibe `settleAlertAck(`, entre `        t,` y
`        showError: setActionError,`. Ancla:
`grep -cxF '        signOut,' <pantalla>` da 1 en cada pantalla. Las
sustituyen estas 6 líneas, idénticas en `src/screens/alerts/index.tsx` (M8) y
en `src/screens/alert-detail/index.tsx` (M9), sin constantes fuera del objeto,
sin imports y sin comentarios:

```tsx
        signOut: () => {
          const run = signOut;
          const key = 'common.somethingWentWrong' as const;
          void Promise.resolve(run()).catch(() => setActionError(t(key)));
          return Promise.resolve();
        },
```

El `numstat` de producción con M8 y M9 da `6 1` en cada pantalla. El
envoltorio esconde `signOut(` (lo lee `screenSignOutCalls`) y `t('…')` (lo lee
`checkUses`). No espera a `signOut`, así que el `finally` de la pantalla
rehabilita el botón antes de que `signOut` termine.

Con M8 y M9 aplicadas, solo C5 y D4 caen, los dos en
`expect(...).toBeDisabled()` («Received instance is not disabled»). Los otros
43 `it` del centro y 28 del detalle siguen verdes, igual que `ui-language`
(30), `design-drift` (65) y el helper (17).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-09) ← gate obligatorio antes de implementar
- Respuestas a Q1–Q5 (frase literal del humano, escrita en la página de Notion): «seguimos la recomendaciones». Q1: se canda el rechazo de `signOut` tras `unauthorized` (C2, D1, R5); Q2: las filas del helper van en `R12_ALERTS`; Q3: el helper entra en `screenSignOutCalls` con 1; Q4: R7 es requisito propio; Q5: sin smoke en dev build de Android.
- [ ] Enmienda E1 aprobada (fecha: …) ← gate de la enmienda; Codex no reanuda la ronda 2 sin ella
