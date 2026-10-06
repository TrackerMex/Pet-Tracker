---
feature: mobile-sign-out-lands-on-welcome
id: 149
status: approved     # draft | approved
tags: [harness, spec, mobile, navigation]
base: e002a4a5 (origin/main con #117)
---

# Requisitos — #149 mobile-sign-out-lands-on-welcome

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[tasks]] para el orden
> test-primero. Rige [[../../docs/ui-guidelines|ui-guidelines]] (trabajo en
> `mobile-pet-tracker/`). Todas las rutas son relativas a `mobile-pet-tracker/`
> salvo que digan otra cosa. Toda cifra y toda ancla se midieron sobre
> `e002a4a5`.

## Contexto

El smoke R13 S8 de #118 (dev build de Android) observó que «Cerrar sesión»
desde Perfil aterriza en **login**, mientras que el arranque en frío sin sesión
aterriza en **welcome** (`src/app/index.tsx`, #118 R2).

Causa, verificada por lectura y medida en un spike fuera del árbol (ver
[[design]] §Evidencia):

- `signOut` (`src/providers/auth-provider.tsx`) solo cambia `status` a
  `unauthenticated`; **ningún** llamador navega después.
- Si la ruta enfocada es una tab, `src/app/(tabs)/_layout.tsx` re-renderiza y
  devuelve `<Redirect href="/login" />`.
- Si la ruta enfocada es un detalle del `Stack.Protected` de
  `src/app/_layout.tsx`, la guarda lo saca de la pila, queda `(tabs)` arriba y
  ese layout manda el mismo `Redirect`.

El destino tras cerrar sesión se decide, por tanto, en **un solo sitio**, sea
cual sea el origen. Esta spec cambia ese sitio y reapunta los candados que hoy
esperan `/login`.

### Orígenes de `signOut` en producción (matriz cerrada)

El registro de la feature nombraba cuatro orígenes. El árbol tiene **trece**
ficheros de producción que llaman a `signOut` (17 llamadas). Todos pasan por el
mismo mecanismo, así que la rama que decide el destino es **dónde está el
usuario** cuando `status` cambia, no quién llamó. La columna «Candado» dice qué
`it` cubre cada origen.

| Origen | Fichero | Ancla (`grep -cF` → salida en `e002a4a5`) | Ruta donde ocurre | Candado |
|---|---|---|---|---|
| Botón «Cerrar sesión» de Perfil | `src/screens/profile/index.tsx` | `'onPress={() => void signOut()}'` → `1` | `/profile` (tab) | R2 fila `/profile` + R4 |
| 401 de la subida de foto de Perfil | `src/screens/profile/index.tsx` | `'await signOut();'` → `1` | `/profile` (tab) | R2 fila `/profile` + R4 |
| 401 de add-pet (dos llamadas) | `src/screens/add-pet/index.tsx` | `'await signOut();'` → `2` | `/pets/add` | R3 fila `/pets/add` + R4 |
| 401 de meal-schedule (dos llamadas) | `src/screens/meal-schedule/index.tsx` | `'await signOut();'` → `2` | `/meal-schedule` | R3 fila `/meal-schedule` + R4 |
| 401 global de cualquier query | `src/providers/query-provider.tsx` | `'createQueryClient(() => void signOutRef.current())'` → `1` | cualquiera | R2 (5 filas) + R3 (12 filas) + R4 |
| 401 de weight-log, alert-detail, geofences, meals-history, alerts, geofence-editor, reminders, pairing (2), add-reminder | `src/screens/<pantalla>/index.tsx` | inventario vivo `screenSignOutCalls` de `src/__tests__/design-drift.test.ts` | su ruta de detalle | R3 fila de su ruta + R4 |

Home, map, health y food no llaman a `signOut`: dependen del 401 global.

## Decisiones para el gate humano

> El spec_author recomienda; **decide el humano**, marcando una casilla por
> decisión. R1–R4 están escritos para la opción recomendada. Elegir la otra
> opción **invalida esta spec**: hay que enmendarla y reabrir el gate antes del
> handoff.

### D1 — Sesión caducada (401) y demás orígenes: ¿welcome o login? (Decisión del humano en el gate)

- **Recomendado: welcome para todos los orígenes.** Razones: (a) hoy el código
  no distingue el origen —todos llaman a la misma `signOut()` sin argumentos y
  el destino lo pone el layout de tabs—, así que el cambio es una línea; (b)
  coincide con el arranque en frío sin sesión (#118 R2), y un token caducado
  detectado al abrir la app es casi un arranque en frío; (c) desde welcome,
  login está a un toque («Ya tengo una cuenta», #118 R8).
- **Alternativa: login solo para la sesión caducada.** Exige que el código sepa
  el motivo: `signOut(reason)` en `src/providers/auth-provider.tsx`, el motivo
  guardado en el estado de sesión, el layout de tabs eligiendo `href` según el
  motivo, y tocar las 17 llamadas para pasarlo. Es otra feature de tamaño
  medio, con su propia matriz de candados.

- [x] D1 = welcome para todos los orígenes (recomendado)
- [ ] D1 = login para 401 y welcome para el botón de Perfil (invalida R1–R4; enmienda)

### D2 — Rutas de detalle bajo `Stack.Protected` sin sesión: ¿welcome o login? (Decisión del humano en el gate)

- **Recomendado: welcome**, consecuencia directa de D1. Hechos medidos en el
  spike: la guarda **no redirige**, bloquea. (a) Cerrar sesión con un detalle
  enfocado lo saca de la pila y el destino lo pone el layout de tabs (R3).
  (b) Empujar un detalle sin sesión deja al usuario donde está: tras R3, en
  welcome; desde login, en login (#105 R8). (c) Un deep link en frío a un
  detalle sin sesión cae en `index` (spike: pathname `/`, pila `['index']`), y
  `index` ya redirige a welcome por #118 R2. Esta spec no cambia (b)-login ni
  (c).
- **Alternativa: login.** Solo tiene sentido junto a la alternativa de D1.

- [x] D2 = welcome (recomendado)
- [ ] D2 = login (invalida R3; enmienda)

### D3 — Dónde vive el cambio (cerrada por el spec_author)

Una línea en `src/app/(tabs)/_layout.tsx`: `href="/login"` → `href="/welcome"`.
Alternativas descartadas, con su motivo, en [[design]] §Alternativas.

## Requisitos funcionales

### R1 — El layout de tabs redirige a welcome sin sesión

WHILE `useAuth().status` es `'unauthenticated'` THE SYSTEM SHALL renderizar en
`src/app/(tabs)/_layout.tsx` un `Redirect` cuyas props son exactamente
`{ href: '/welcome' }`, y no renderizar `Tabs`.

- Con `'loading'` sigue sin renderizar nada; con `'authenticated'` sigue
  renderizando las cinco tabs (los otros cuatro `it` de la suite no cambian).
- Anclas de producción: `grep -cF 'href="/welcome"' 'src/app/(tabs)/_layout.tsx'`
  → hoy `0`, tras R1 `1`; `grep -cF 'href="/login"' 'src/app/(tabs)/_layout.tsx'`
  → hoy `1`, tras R1 `0`.
- Test: en `src/app/(tabs)/__tests__/layout.test.tsx`, el
  `it('redirects an unauthenticated session to login', …)` del
  `describe('R1: (tabs) exige sesión')` pasa a llamarse
  `it('#149 R1: redirects an unauthenticated session to welcome', …)` y asevera
  `{ href: '/welcome' }`. La suite sigue en 5 `it`.
- Anclas del test: `grep -cF "it('redirects an unauthenticated session to login'"`
  → hoy `1`, tras R1 `0`; `grep -cF "{ href: '/login' }"` → hoy `1`, tras R1
  `0`; `grep -cF "{ href: '/welcome' }"` → hoy `0`, tras R1 `1` (las tres sobre
  `'src/app/(tabs)/__tests__/layout.test.tsx'`).

### R2 — Cerrar sesión en cualquiera de las cinco tabs aterriza en welcome

WHEN `status` pasa de `'authenticated'` a `'unauthenticated'` con la ruta
enfocada en **cada una** de `/home`, `/map`, `/health`, `/food` y `/profile`
THE SYSTEM SHALL dejar `getPathname()` en `'/welcome'` y la pila raíz
exactamente en `['welcome']`.

- Una fila por tab (`it.each` de cinco filas: cada fila es un `it`). Cubre el
  botón de Perfil, el 401 de la foto de Perfil y el 401 global en cualquier tab.
- `['welcome']` y no `['(tabs)', 'welcome']`: el `Redirect` reemplaza la pila, y
  por eso el botón atrás de Android desde welcome sale de la app (smoke S2).

### R3 — Cerrar sesión en cualquiera de las doce rutas de detalle aterriza en welcome

WHEN `status` pasa de `'authenticated'` a `'unauthenticated'` con la ruta
enfocada en **cada una** de las doce rutas protegidas empujadas sobre `/home`
—`/add-reminder`, `/pets/add`, `/pets/pet-1/docs`, `/weight-log`,
`/meal-schedule`, `/pairing`, `/reminders`, `/alerts`, `/alerts/alert-1`,
`/pets/pet-1/geofences`, `/pets/pet-1/geofence-editor`, `/meals-history`—
THE SYSTEM SHALL dejar `getPathname()` en `'/welcome'` y la pila raíz en
`['welcome']`; y un `router.push` posterior a esa misma ruta SHALL dejar
pathname y pila sin cambios.

- Las doce son los doce `Stack.Screen` dentro de
  `<Stack.Protected guard={status === 'authenticated'}>` en
  `src/app/_layout.tsx` (los segmentos dinámicos se rellenan con `pet-1` y
  `alert-1`).
- Los dos candados que hoy esperan login **tras cerrar sesión** cambian a
  welcome, sin renombrar sus `it`:
  - `src/app/__tests__/detail-stack.guard.test.tsx`,
    `describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password')`:
    `'/login'` → `'/welcome'` (2 veces), `['(auth)']` → `['welcome']`
    (2 veces), `['(auth)', 'reset-password']` → `['welcome', 'reset-password']`
    (1 vez).
  - `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`,
    `describe('#114 R2: reminders y alerts se apilan y desapilan sobre (tabs)')`:
    `'/login'` → `'/welcome'` (2 veces), `['(auth)']` → `['welcome']` (2 veces).
- **No cambia** `describe('#105 R8: meals history requires a session')` del
  mismo fichero de guarda: arranca en `/login` sin sesión y nunca cierra
  sesión; su destino es login por diseño (D2 b).
- Anclas en `src/app/__tests__/detail-stack.guard.test.tsx`:
  `grep -cF "toBe('/login')"` → hoy `4`, tras R3 `2` (las de #105 R8);
  `grep -cF "toEqual(['(auth)'])"` → hoy `3`, tras R3 `1`;
  `grep -cF "['(auth)', 'reset-password']"` → hoy `1`, tras R3 `0`.
  En `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`:
  `grep -cF "toBe('/login')"` → hoy `2`, tras R3 `0`;
  `grep -cF "toEqual(['(auth)'])"` → hoy `2`, tras R3 `0`.

### R4 — Ningún fichero de producción navega a login salvo los cuatro declarados

THE SYSTEM SHALL mantener las referencias a la ruta de login en el código de
producción de `src/` (todo `.ts`/`.tsx` fuera de `__tests__/` y de
`*.test.ts(x)`), contadas con la expresión `/['"`]\/(?:\(auth\)\/)?login\b/g`,
exactamente en este mapa:

```ts
{
  'app/(auth)/register.tsx': 1,
  'screens/forgot/index.tsx': 1,
  'screens/reset-password/index.tsx': 2,
  'screens/welcome/index.tsx': 1,
}
```

- Hoy (medido en `e002a4a5`) el mapa tiene además `'app/(tabs)/_layout.tsx': 1`,
  que R1 quita.
- Es el candado de **todos** los orígenes de la matriz a la vez: si cualquier
  llamador de `signOut` (o el 401 global) añade un `router.replace('/login')`,
  un `router.push('/(auth)/login')` o un `Redirect` a login, su fichero aparece
  en el mapa y el test cae. Los tests de R2/R3 no lo verían: pintan stubs en
  lugar de las pantallas.
- Las cuatro entradas son navegación intencional a login, fuera de alcance
  (registro tras crear cuenta, «olvidé contraseña», reset-password y el CTA «Ya
  tengo una cuenta» de welcome).
- El endpoint `'/auth/login'` de `src/api/auth.ts` no cuenta (la expresión exige
  `/login` o `/(auth)/login` justo tras la comilla).
- Un comentario de producción que cite `'/login'` entre comillas también cuenta:
  es un rojo buscado, no un falso positivo.

## Restricciones de no regresión (sin test nuevo)

- **NR1 — Arranque en frío.** `src/app/__tests__/index.test.tsx` (3 `it`,
  incluido `'#118 R2: redirects an unauthenticated session to welcome'`) y
  `src/screens/welcome/index.test.tsx` (28 `it`) quedan **sin diff** y verdes.
- **NR2 — Layout raíz.** `src/app/_layout.tsx` y
  `src/app/__tests__/layout.test.tsx` (26 tests) quedan sin diff.
- **NR3 — Llamadores de `signOut`.** Ninguno cambia: el inventario
  `screenSignOutCalls` de `src/__tests__/design-drift.test.ts` sigue verde sin
  tocarlo.
- **NR4 — Sin copy.** Esta feature no añade ni cambia texto visible. No se toca
  `src/i18n/catalog.ts`, ni el recuento de
  `src/providers/__tests__/language-provider.test.tsx`, ni
  `src/__tests__/ui-copy-table.ts`, ni `SCREEN_FILES`/`checkUses(ALL_USES)` de
  `src/__tests__/ui-language.test.ts`.
- **NR5 — Sin dependencias nuevas** ni cambios en `package.json` o `bun.lock`.
- **NR6 — Sin cambio visual.** No se toca ninguna pantalla: welcome se
  reutiliza tal cual (#118). El grep-clean y las dimensiones de
  `docs/ui-guidelines.md` no aplican porque ningún fichero de UI cambia.

## Fuera de alcance

Clasificadas viñeta a viñeta. «Delimitación» = no es trabajo pendiente;
«Feature aparte» = trabajo real que esta spec no hace.

- **Delimitación** — `router.replace('/login')` de `src/app/(auth)/register.tsx`
  y los `router.push('/login')` de reset-password y forgot: navegación
  intencional a login, no salida de sesión. Verificado: son tres de las cuatro
  entradas del mapa de R4.
- **Delimitación** — `router.push('/login')` del CTA «Ya tengo una cuenta» de
  welcome (#118 R8): cuarta entrada del mapa de R4.
- **Delimitación** — Empujar un detalle sin sesión **desde login** sigue en
  login (#105 R8, D2 b). Verificado: ese `describe` no cierra sesión.
- **Delimitación** — Deep link en frío a un detalle sin sesión: ya cae en
  `index` y de ahí a welcome (D2 c, medido en el spike con `index` como stub).
  Sin test nuevo porque esta spec no lo toca.
- **Feature aparte (si el humano la quiere)** — Distinguir sesión caducada de
  cierre voluntario (alternativa de D1).
- **Feature aparte (si el humano la quiere)** — Tests que aseveren que el 401
  de la foto de Perfil y los 401 de add-pet llaman a `signOut`. Verificado:
  `grep -ci 'unauthorized\|401' src/screens/add-pet/index.test.tsx` → `0` y
  `grep -ci 'unauthorized\|401' src/screens/profile/index.test.tsx` → `0`. Esta
  spec no los necesita: el destino no depende de quién llama, y R4 candea que
  nadie navegue a login por su cuenta.
- **Delimitación** — Una ruta protegida que se añada después no entra sola en
  las filas de R3: quien la añada amplía la lista.

## Prueba de humo (gate humano, dev build de Android)

> **Dev build de Android, nunca Expo Go.** Cada prerrequisito y cada paso lleva
> su casilla. Si `adb devices` muestra dos transportes (IP y mDNS), todo
> comando lleva `adb -s <ip:puerto>`.

Prerrequisitos:

- [ ] P1 — Dev build de Android instalado en el teléfono y Metro sirviendo esta
      branch (`bunx expo start --dev-client` desde `mobile-pet-tracker/`).
- [ ] P2 — Backend levantado y alcanzable desde el teléfono en la URL de
      `EXPO_PUBLIC_API_URL` del `.env` del móvil (el login funciona).
- [ ] P3 — Cuenta verificada para iniciar sesión.
- [ ] P4 — `adb devices` muestra un solo transporte, o se usa
      `adb -s <ip:puerto>` en cada comando.

Pasos:

- [ ] S1 — Con sesión, Perfil → «Cerrar sesión»: aparece **welcome**; en ningún
      frame se ve login.
- [ ] S2 — Desde ese welcome, botón atrás de Android: sale de la app (no vuelve
      a Perfil ni a ninguna tab).
- [ ] S3 — Sesión caducada (cubre D1 = welcome): con sesión iniciada, cierra la
      app; reinicia el backend con otro `JWT_SECRET` (por ejemplo, añadiendo
      `-149` al valor que use tu backend); abre la app: home pide datos, el
      backend responde 401 y la app aterriza en **welcome**. Después,
      **restaura** el `JWT_SECRET` original y reinicia el backend.
- [ ] S4 — Regresión, arranque en frío **sin sesión**:
      `adb -s <ip:puerto> shell am force-stop com.trackermex.pettracker` y abrir
      la app: welcome.
- [ ] S5 — Regresión, arranque en frío **con sesión**: welcome → «Ya tengo una
      cuenta» → login correcto → home; atrás desde home sale de la app;
      `force-stop` y abrir: home directo, sin frame de welcome ni de login.

- [ ] Prueba de humo firmada por humano (fecha: ____, cuenta: ____)

## Aprobación

> Tres gates, tres casillas: decisiones, spec y prueba de humo.

### Decisiones D1 y D2

- [x] D1 y D2 decididas por humano (casillas de §Decisiones para el gate humano). En el espejo de Notion quedaron marcadas las dos opciones de cada decisión; el humano lo aclaró en el chat de la sesión Backend el 2026-10-06: D1 = welcome para todos los orígenes, D2 = welcome. R1–R4 quedan tal cual

### Aprobación de la spec

- [x] Aprobado por humano (fecha: 2026-10-06, desde Notion: página `3f16115a-9b27-817d-b737-cb4face9d519`, `Estado del gate` = Aprobado, `page_last_edited_at` 2026-10-06T16:26:29.921Z) ← gate obligatorio antes de implementar

### Prueba de humo

- [ ] P1–P4 y S1–S5 firmadas por humano en dev build de Android (fecha: ____)
