---
feature: "mobile-alert-ack-outcome-helper"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-alert-ack-outcome-helper]] (#134)

Rutas relativas a `mobile-pet-tracker/`. Requisitos en `requirements.md`;
orden de commits y anclas en `tasks.md`.

## 1. Decisión central

Una **función async** en `src/utils/` recibe la petición y cinco callbacks, y
resuelve el `switch` entero. Las pantallas inyectan lo que difiere (dónde
guardar el `Alert` y qué hacer con `not-found`) y siguen dueñas de su guard de
vuelo y de su `finally`.

`specs/mobile-alert-detail-screen/requirements.md` §Fuera de alcance decía que
unificar el `switch` «exige un hook con dos políticas». No hace falta un hook:
no hay estado compartido entre las pantallas, y las dos políticas son
callbacks. Esta spec sustituye esa estimación; no contradice ningún requisito
de #100.

## 2. Helper — `src/utils/alert-ack-outcome.ts`

Fichero nuevo con su test al lado, `src/utils/alert-ack-outcome.test.ts`
(convención de `src/utils/` en `docs/conventions.md`). Solo importaciones de
tipo:

- `AckAlertState` desde `'../api/alerts'`
- `Alert` desde `'../api/types'`
- `TranslationKey` desde `'../i18n/catalog'`

Símbolos exportados (nombres y firma cerrados):

```ts
export type AlertAckHandlers = {
  t: (key: TranslationKey) => string;
  signOut: () => Promise<void>;
  showError: (message: string) => void;
  onAcked: (next: Alert) => void;
  onNotFound: () => void;
};

export async function settleAlertAck(
  request: () => Promise<AckAlertState>,
  alert: Alert,
  { t, signOut, showError, onAcked, onNotFound }: AlertAckHandlers,
): Promise<void>
```

- Los handlers se **desestructuran en la firma** para que el cuerpo llame
  `t('common.cannotReachServer')` y `t('common.somethingWentWrong')` con la
  forma que cuentan `checkUses` y las anclas de `tasks.md`.
- `request` es un **thunk**, no una promesa ya creada: el helper lo llama
  dentro de su `try`, y así un lanzamiento síncrono cae en el mismo `catch`
  que hoy lo atrapa en la pantalla (R5).
- Un único `try` cubre `await request()`, el `switch` entero y el
  `await signOut()`. El `catch` (sin variable) llama
  `showError(t('common.somethingWentWrong'))`. El helper **nunca rechaza**.
- No toca React Query ni ninguna caché (R7).

| Rama | Llamada del helper |
|---|---|
| `ok` | `onAcked(result.alert)` (misma referencia) |
| `already-closed` | `onAcked({ ...alert, status: 'closed' })` |
| `not-found` | `onNotFound()` |
| `unreachable` | `showError(t('common.cannotReachServer'))` |
| `unauthorized` | `await signOut()` |
| `error`, `missing-config` | `showError(t('common.somethingWentWrong'))` (un solo `case` doble) |
| catch | `showError(t('common.somethingWentWrong'))` |

Resultado en el fuente del helper: 7 `case '`, 1 `signOut(`, 1
`t('common.cannotReachServer')`, 2 `t('common.somethingWentWrong')`.

## 3. Pantallas tras R6

Cada `handleAck` conserva su guard, su `setActionError(null)` y su
`try { … } finally { … }`; el `catch` de la pantalla desaparece (el helper no
rechaza). Dentro del `try` queda una sola sentencia:
`await settleAlertAck(() => ackAlert(baseUrl, token ?? '', <id>), alert, { … })`,
con el mismo tercer argumento de `ackAlert` que hoy. Importación nueva en las
dos: `settleAlertAck` desde `'../../utils/alert-ack-outcome'`.

| Handler | Centro (`src/screens/alerts/index.tsx`) | Detalle (`src/screens/alert-detail/index.tsx`) |
|---|---|---|
| `t` | `t` de `useTranslate()` | `t` de `useTranslate()` |
| `signOut` | `signOut` de `useAuth()`, pasado sin llamarlo | igual |
| `showError` | `setActionError` | `setActionError` |
| `onAcked` | función que escribe `next` en el mapa `acked` bajo `alert.id` (lo que hoy hace `case 'ok'`) | `setAcked` |
| `onNotFound` | función que hace `setActionError(t('common.somethingWentWrong'))` | el bloque actual de `case 'not-found'`: si `leavingRef.current` es falso, lo pone a `true` y llama `router.dismissTo('/alerts')` |

Tipos: `useTranslate()` devuelve `(key, params?) => string`, asignable a
`(key) => string`; `setActionError` y los `setAcked` aceptan los tipos de los
handlers. No hace falta ningún cast.

## 4. Por qué el orden de los requisitos

1. **R1, R2 primero**: caracterizan las ramas sin candado (C1, C2, D1) contra
   el código de la base, antes de mover nada.
2. **R3–R5**: construyen el helper con su test unitario, sin que ninguna
   pantalla lo use todavía. El commit rojo de R3 crea el helper como esqueleto
   con la firma final, así el rojo es por aserción y no `Cannot find module`.
3. **R6**: los inventarios globales se mueven en el commit rojo y las
   pantallas en el verde.
4. **R7**: candado de caché, cerrado por mutación.

## 5. Candados globales que mueve #134

Lista para el leader (y para Backend, #158). Todo delta va relativo a H0.

| Candado | Fichero | Movimiento |
|---|---|---|
| `screenSignOutCalls` (#87 R19) | `src/__tests__/design-drift.test.ts` | `'screens/alerts/index.tsx'` 1→0 (−1); `'screens/alert-detail/index.tsx'` 1→0 (−1); entrada nueva `'utils/alert-ack-outcome.ts': 1` (+1). Neto −1. La entrada nueva también hace que «keeps literal query keys out of every migrated screen» revise el helper |
| `describe('#134 R6')`, `describe('#134 R7')` | `src/__tests__/design-drift.test.ts` | +2 its (it.each) y +1 it, al final del fichero |
| `R12_ALERTS` | `src/__tests__/ui-copy-table.ts` | −2 `common.somethingWentWrong` del centro, −1 `common.cannotReachServer` del centro, +1 `common.cannotReachServer` del helper, +2 `common.somethingWentWrong` del helper. Neto 0 |
| predicado de #78 R12 | `src/__tests__/ui-language.test.ts` | `\|\| file === 'src/utils/alert-ack-outcome.ts'` |
| `R13_ALERT_DETAIL` | `src/__tests__/ui-copy-table.ts` | −2 `common.somethingWentWrong` y −1 `common.cannotReachServer` del detalle (−3) |
| longitud de #100 R10 | `src/__tests__/ui-language.test.ts` | `toHaveLength(11 - 3)` |
| `ALL_USES` | `src/__tests__/ui-copy-table.ts` | −3 (suma de bloques; su test se recalcula solo) |
| `SCREEN_FILES` (#65 R18) | `src/__tests__/ui-language.test.ts` | +1 |

Lo que #134 **no mueve**: `src/i18n/catalog.ts`, el recuento de claves de
`src/__tests__/language-provider.test.tsx`, `consistency-classnames` (ningún
`className` cambia), los guards de legibilidad, `R4_MAP`, `R7_PROFILE`,
`R14_GEOFENCES` y sus recuentos en `ui-language.test.ts`.

**Guards que los ficheros nuevos deben respetar:**

- `HEX_LITERAL` de `design-drift.test.ts` (``#(?!\d{2,3} R\d)[\da-f]{3,8}\b``):
  toda cita de la feature en `src/` se escribe `#134 R<n>`; un `#134` suelto
  casa como color.
- `ARBITRARY_CLASS` (`-[`): no aparece en ningún fichero nuevo.
- El escaneo de #65 R18 compara cada literal entero del helper con todos los
  valores fijos del catálogo. Los literales previstos del helper (los siete
  `kind`, `'closed'`, las rutas de import y las dos claves) no coinciden con
  ningún valor del catálogo (medido en la base).
- Sin `StyleSheet`, sin `queryKey: [`, sin dependencias nuevas.

## 6. Features en paralelo

- **#158 (Backend)** añade en `screenSignOutCalls` la línea
  `'screens/docs/index.tsx'` (0→1), justo encima de las dos de alertas. El
  conflicto con #134 es trivial: **quien mergee segundo conserva las dos
  líneas** (la de docs de #158 y las de alertas y helper de #134). #158 toca
  también `R7_PROFILE` y su recuento, `rounded-xl bg-accent` (17→19),
  `catalog.ts` y el recuento de claves (371→383); #134 no toca ninguno.
- **#159 (UI-Pet)** cambia `R4_MAP` y `R14_GEOFENCES` en `ui-copy-table.ts` y
  sus recuentos en `ui-language.test.ts`. #134 no los toca; entre la fila
  `common.cannotReachServer` del detalle que se borra y el bloque `R14` quedan
  sin cambios la fila `common.retry` del detalle, el `];` y la cabecera
  `export const R14_GEOFENCES`.
- `ALL_USES` (−3) y `SCREEN_FILES` (+1) se expresan como **delta**: quien
  mergee segundo recuenta.

## 7. Alternativas descartadas

- **Clasificador puro que devuelve una clave o una acción**: cada pantalla
  seguiría con su `switch` sobre la acción, y `t(variable)` no lo cuenta
  `checkUses`, así que el inventario de copy dejaría de ver los usos.
- **Hook `useAlertAck`**: no hay estado compartido; los guards de vuelo
  difieren (por id en el centro, único en el detalle).
- **Bloque nuevo `R17` en `ui-copy-table.ts`**: más cambios (`ALL_USES` y su
  test de suma) sin ganancia; `R12_ALERTS` ya aloja `src/utils/alert-meta.ts`.
- **Dejar `signOut` en las pantallas**: el `switch` seguiría partido en dos
  sitios, contra el criterio de aceptación.
- **Recibir la promesa ya creada**: un lanzamiento síncrono de `ackAlert(...)`
  saldría fuera del `try` del helper; hoy lo atrapa el `catch` de la pantalla.
- **Invalidar `alertKeys.list()`**: prohibido por #100 D2 y R5.

## 8. Riesgos

- **Una microtarea más** entre el resultado y el `finally` de la pantalla (el
  helper es otra función async). Los tests existentes esperan sobre el árbol
  con `waitFor`, no sobre microtareas contadas. Si alguno se pone rojo, Codex
  **para** y lo reporta: R1/R2 prohíben tocar los tests existentes.
- **Fugas entre its**: `jest.clearAllMocks()` no borra implementaciones; los
  tests nuevos usan `mockRejectedValueOnce`, nunca `mockRejectedValue`, sobre
  `mockAckAlert` y `mockSignOut`.

## 9. Convenciones y skills

- Títulos con el prefijo `#134 R<n>` (`docs/conventions.md` §Prefijo de
  feature).
- Esperas (`docs/conventions.md` §Esperas sobre el árbol renderizado): «La
  condición que termina una espera debe ser la misma observación que hacen las
  aserciones posteriores. Si el test asevera el árbol, espera al árbol: esperar
  a la caché de Query o al contador de un mock y consultar el DOM después
  introduce una carrera. Una aserción de ausencia se ancla primero a la
  aparición o al estado final de un nodo positivo del mismo escenario.» Los
  tests nuevos esperan al texto del nodo de error y asertan el contador de
  `signOut` después.
- Las dos suites de pantalla renderizan con `renderAlerts()` /
  `renderDetail()` y siempre con `await`. Ninguna usa `renderRouter`; si un test
  nuevo lo usara, también con `await`.
- Skills de nuestro lado: `expo:expo-overview` y después `expo-data-fetching`
  (solo como contexto: no cambia ninguna petición). Los nombres de skill para
  Codex los pone el leader en el handoff con su catálogo (deuda B5); esta spec
  no nombra skills de Codex.
- Sin dependencias nuevas. `mobile-pet-tracker/package.json` no tiene
  prettier: el formato es el del fichero.
