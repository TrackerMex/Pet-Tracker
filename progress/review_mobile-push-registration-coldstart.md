# review: mobile-push-registration — arreglo del defecto del gate humano (paso 8, R10)

Fecha: 2026-09-20
Rama: `feature/79-mobile-push-registration` @ `eaf7fa9b`
Alcance: el defecto de arranque en frío reportado el 2026-09-19. R1-R11, R13 y
R14 se miran **solo como regresión** (aprobados en
`progress/review_mobile-push-registration.md` y
`progress/review_mobile-push-registration-r13-r14.md`).
Commits revisados: `c231651a` (rojo) → `0a68e99e` (verde) → `3a1f5a56` (reporte),
sobre `8d4f83c6` y con el merge `eaf7fa9b` de `origin/main` (trae #90).

**Veredicto: APROBADO** — con una zona ciega registrada (§5 y §Observaciones)
que **no** bloquea el cierre pero conviene cerrar en la próxima ronda.

R12 sigue pendiente por definición: es el gate humano y hay que repetir el
paso 8 en el dev build de Android.

---

## 1. El rojo reproduce el defecto de verdad — SÍ

Verificado por mí, no por el reporte. Procedimiento: revertir **solo** el
fichero de implementación a su versión pre-arreglo y correr el test.

```
$ git checkout c231651a -- mobile-pet-tracker/src/hooks/use-push-registration.ts
$ bunx jest src/hooks/use-push-registration.navigation.test.tsx
FAIL src/hooks/use-push-registration.navigation.test.tsx
  ● R10: cold start conserva alertas frente al redirect autenticado › termina en alertas y vuelve una sola vez a Home

    Unable to find an element with testID: alerts-route

    <Text testID="home-route">Home</Text>

      > 134 |     expect(screen.getByTestId('alerts-route')).toBeOnTheScreen();

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
```

El fallo es **el defecto**: con el código anterior el árbol termina renderizando
Home en vez de Alerts, que es literalmente lo que el humano vio en el teléfono.
No es una aserción cosmética: la aserción es sobre el árbol renderizado, y el
nodo que aparece en su lugar es `home-route`.

Además comprobé la versión **original** del test tal y como se commiteó en
`c231651a` (la que usa el router real vía `renderRouter`), contra el mismo
código pre-arreglo:

```
$ git checkout c231651a -- mobile-pet-tracker/src/hooks/use-push-registration.navigation.test.tsx
$ bunx jest src/hooks/use-push-registration.navigation.test.tsx
    expect(received).toBe(expected) // Object.is equality
    Expected: "/alerts"
    Received: "/home"
      > 125 |     await waitFor(() => {
        126 |       expect(app.getPathname()).toBe('/alerts');
```

Coincide exactamente con lo que `progress/current.md` afirma del rojo
(`Expected: /alerts, Received: /home`). El relato del reporte es cierto.

Árbol restaurado a HEAD después de cada experimento (`git status --short` vacío,
comprobado dos veces).

## 2. El arreglo espera a una condición, no a un tiempo — SÍ

`mobile-pet-tracker/src/hooks/use-push-registration.ts:108-123`: el segundo
efecto se guarda con `!pushReady.current || pathname === '/' ||
handledInitialResponse.current`. Las dos señales son reales:

- `pathname` viene de `usePathname()` de expo-router. Mientras vale `/`, el
  `<Redirect href="/home" />` de `src/app/index.tsx:11` sigue pendiente; en
  cuanto deja `/`, el redirect ya se aplicó. Es el estado del router, no un reloj.
- `pushReady` (`:39`, `:43`, `:67`) es un `ref` que el primer efecto pone a
  `true` solo después de pasar sus cuatro guardas (sesión, dispositivo,
  plataforma, `projectId`). Los efectos corren en orden de declaración dentro
  del mismo commit, así que la marca está publicada antes de que el segundo
  efecto la lea.
- Las deps del segundo efecto incluyen `status` y `token` a propósito: cubren el
  caso en que el pathname cambia **antes** de que la sesión resuelva, para que
  el efecto vuelva a correr cuando `pushReady` ya sea `true`.

Grep de temporizadores sobre el diff de los tres commits:

```
$ git diff c231651a^..3a1f5a56 | grep -nE "setTimeout|setInterval|InteractionManager|requestAnimationFrame|advanceTimersByTime|useFakeTimers|sleep\(|delay\("
264:+  modifico y no se añadió ningun `setTimeout`.
```

La única coincidencia es la frase del propio reporte. Cero temporizadores, cero
`InteractionManager`, cero espera por milisegundos. (Los `jest.useFakeTimers()`
que aparecen si se difea `8d4f83c6..HEAD` son de #90 `weight-log.test.tsx`, que
entró por el merge `eaf7fa9b`, no de esta reparación.)

## 3. El paso 7 (segundo plano) no se rompió — SÍ

El camino del listener quedó **intacto** y sigue navegando de inmediato:
`use-push-registration.ts:68-71` registra
`addNotificationResponseReceivedListener` dentro del primer efecto y su callback
sigue siendo `router.push('/alerts')` sin diferir nada. El arreglo solo sacó del
primer efecto el bloque de `getLastNotificationResponseAsync`.

Cobertura viva del camino de segundo plano:
`src/hooks/use-push-registration.test.tsx:434` — `it('navega una vez al recibir
un tap con sesión')` asevera `mockRouterPush` llamado 1 vez con `'/alerts'`.
Pasa en la corrida completa (§6).

## 4. `src/app/index.tsx` no se tocó — CONFIRMADO

```
$ git diff 8d4f83c6..HEAD -- mobile-pet-tracker/src/app/index.tsx
(salida vacía)
```

No hace falta justificación por escrito porque no hubo que salirse de la lista
de ficheros de la spec. Los cuatro ficheros de `0a68e99e` son el hook, su test,
el test de navegación nuevo y `src/app/__tests__/layout.test.tsx` (que solo
añade `usePathname` a su mock de `expo-router`, obligado porque el hook ahora lo
consume).

## 5. La pila de navegación — CORRECTA, pero mal aseverada

El comportamiento es el bueno. El arreglo deja que el `replace` del redirect
asiente `/home` **primero** y solo entonces hace `push('/alerts')`, así que la
pila queda `['/home', '/alerts']`: una pulsación de atrás lleva a Home y desde
ahí se sale. Eso corrige las dos mitades del reporte del humano (destino
equivocado **y** entrada duplicada).

Lo verifiqué **contra el router real**, no contra el reporte: recuperé el arnés
de `c231651a` (`renderRouter` + `Stack` + rutas reales + `router.canGoBack()`)
y lo corrí contra la implementación **arreglada** de HEAD:

```
$ git checkout HEAD -- .../use-push-registration.ts        # impl arreglada
$ git checkout c231651a -- .../use-push-registration.navigation.test.tsx
$ bunx jest src/hooks/use-push-registration.navigation.test.tsx
PASS  ✓ termina en alertas y vuelve una sola vez a Home
# 5 corridas seguidas: 5/5 verdes, sin flake
```

Ese arnés asevera `app.getPathname() === '/alerts'`, luego `router.back()` y
`router.canGoBack() === false` **con el router de verdad**. Pasa. La pila real es
la correcta.

**Zona ciega (esto es lo que hay que anotar).** El test que quedó commiteado
(`0a68e99e`) **no** es ese. El verde reescribió el arnés y sustituyó
`expo-router` entero por un doble hecho a mano
(`use-push-registration.navigation.test.tsx:11-38`: un array `mockHistory` con
`mockPush`/`mockReplace`/`mockBack`/`mockCanGoBack`). Consecuencias:

- La carrera ya no se reproduce, se **guioniza**: el test llama a
  `mockReplace('/home')` en el momento que él elige.
- `expect(mockCanGoBack()).toBe(false)` (`:141`) asevera `mockHistory.length > 1`,
  o sea la propia función de tres líneas del test. Esa aserción pasaría con
  cualquier implementación: **la mitad "pila" del defecto del humano no queda
  guardada por nada.**
- El modelo del doble tampoco es fiel: su `replace` pisa la última entrada,
  mientras que el `<Redirect>` real reemplaza la entrada de índice.

No lo convierto en rechazo por tres razones: (a) la mitad "destino" sí queda
guardada y falla de verdad contra el código anterior (§1); (b) el doble también
atrapa un cambio de `push` a `replace` en el camino de arranque en frío, que era
el otro fallo plausible; y (c) tengo prueba directa de que la pila real es
correcta. Pero el arnés bueno ya existe, está en el historial y es estable 5/5,
así que la corrección es un revert del cuerpo del test a la versión de
`c231651a`. Ver §Observaciones.

## 6. Regresión completa — VERDE, corrida por mí

`pgrep -af "init.sh|jest"` antes de cada lanzamiento: nada corriendo (sin
colisión con el otro worktree).

Recuento de suites móviles, para descartar ficheros saltados en silencio:

```
$ bunx jest --listTests | wc -l
77
$ bunx jest          # sin pipe
Test Suites: 77 passed, 77 total
Tests:       1348 passed, 1348 total
Snapshots:   1 passed, 1 total
EXIT=0
```

77 = 77. Ningún fichero se quedó fuera del filtro.

(El reporte de Codex dice 76/1332 porque se escribió **antes** del merge
`eaf7fa9b`; #90 añade `src/utils/civil-today-iso.test.ts` y sus tests de
`weight-log`. La diferencia está explicada, no es un descuadre.)

`./init.sh` desde la raíz, sin pipe, exit 0:

| Bloque | Resultado |
|---|---|
| Backend | 170 suites / 1295 tests |
| Infraestructura | 2 suites / 14 tests |
| Móvil | 77 suites / 1348 tests, 1 snapshot |
| e2e | 27 de 30 suites (3 omitidas) / 384 pasados, 8 omitidos |
| Build, Lint, Typecheck | verdes |

`git status --short` vacío después de `init.sh` (el `eslint --fix` no tocó nada).

## 7. Estado tras el merge de #90 — COHERENTE

- `feature_list.json`: **101** features, **85 `done`**, 15 `pending`, 1
  `in_progress` (#79). #90 = `done`.
- `STATUS.md:4`: `**Features completadas**: 85/101`. `STATUS.md:5` describe #79
  como «R10 reparado tras el rechazo del gate; espera repetir el paso 8 de R12».
  `init.sh` imprime `✅ STATUS.md sincronizado con feature_list.json`.
- Candado del catálogo,
  `src/providers/__tests__/language-provider.test.tsx:55`:
  `expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2 + 1);` — el
  `+1` de #90 está.
- Delta i18n de #79 = **cero**:
  `git diff --stat c231651a^..3a1f5a56 -- mobile-pet-tracker/src/i18n/` sale
  vacío. Lo único que movió el número fue #90.

## 8. Trazabilidad — CORRECTA

`specs/mobile-push-registration/traceability.md:20`, fila R10, cita ahora las
dos parejas:

> `1d404ebc` rojo → `be3f8bb5` verde; regresión del gate: `c231651a` rojo →
> `0a68e99e` verde

y también el fichero de test nuevo
(`use-push-registration.navigation.test.tsx::R10: cold start conserva alertas
frente al redirect autenticado`), que nombra su R-id en el `describe`.

Ancestría de los cuatro hashes:

```
1d404ebc ancestro-de-HEAD OK
be3f8bb5 ancestro-de-HEAD OK
c231651a ancestro-de-HEAD OK
0a68e99e ancestro-de-HEAD OK
```

`R12` (`:24`) sigue «pendiente», que es lo esperado: es el gate humano y hay que
repetirlo. Es la **única** fila pendiente del fichero.

Formato de commits: `test(...)`, `fix(...)`, `docs(...)` con scope
`mobile-push-registration` y `(R10)` en los dos de código. Conforme a
`docs/conventions.md` §Commits.

## 9. Sin `npx` nuevo — CONFIRMADO

```
$ git diff c231651a^..3a1f5a56 | grep -n "npx"
(sin coincidencias)
```

La única aparición de `npx` en la spec es `requirements.md:609`, dentro de la
enmienda E1, que se introdujo en `b1204355` (anterior a esta reparación) y está
marcada explícitamente como cita histórica: «Los comandos de este relato se
citan tal y como se ejecutaron entonces, con `npx`; la norma vigente es `bunx`».
No es deuda nueva. El reporte de implementación y `progress/current.md` usan
`bunx` en todos sus comandos vivos.

---

## Checklist de CHECKPOINTS

### C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (#79)
- [x] `progress/current.md` actualizado con el rechazo del gate y la reparación
- [x] `STATUS.md` sincronizado con `feature_list.json` (85/101)

### C3 — Arquitectura
- [x] N/A a capas de dominio: el cambio vive entero en la capa de presentación
      móvil (`src/hooks/`), que es donde la spec lo ubica
      (`specs/mobile-push-registration/design.md` §Ficheros)
- [x] El hook sigue siendo el único importador de `expo-notifications`
- [x] `_layout.tsx:61` mantiene `<PushRegistration />` dentro de
      `AuthProvider`/`QueryProvider` y como hermano del `<Stack />`, que es lo
      que hace que `usePathname()` tenga contexto de router

### C4 — TDD
- [x] R10 tiene tests que lo nombran: `describe('R10: banner en primer plano…')`
      y `describe('R10: cold start conserva alertas frente al redirect
      autenticado')`
- [x] Historial test-primero real: `c231651a` rojo (verificado por mí contra el
      código anterior) → `0a68e99e` verde → `3a1f5a56` docs. Tres commits, no uno

### C5 — Trazabilidad
- [x] Fila de R10 actualizada con los hashes del arreglo, todos ancestros de HEAD
- [x] Commits con formato `<tipo>(<scope>): <desc> (R10)`
- [ ] `traceability.md` sin filas «pendiente» → **R12 sigue pendiente a
      propósito**: es el gate humano, no tiene test automático y hay que
      repetirlo. Es la excepción esperada, no un descuido

### C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`
- [x] R10 **no cambió**: esto es un defecto contra el requisito vigente, no una
      enmienda, así que no hay firma humana nueva que buscar

### C7 — Sin código huérfano
- [x] N/A — esta reparación no reemplaza ni deprecia ningún componente

---

## Observaciones

Ninguna bloqueante. Una para la próxima ronda y una nota de contexto:

1. **(recomendado, no bloqueante) Devolver el arnés de router real al test de
   regresión.** `mobile-pet-tracker/src/hooks/use-push-registration.navigation.test.tsx`
   pasó de usar `renderRouter` con el router de verdad (`c231651a`) a un doble
   hecho a mano (`0a68e99e`). Comprobé que la versión con router real **pasa
   contra el arreglo, 5 de 5 corridas**, así que no había flake que justificara
   el cambio. Lo que se pierde: `expect(mockCanGoBack()).toBe(false)` asevera el
   propio helper del test, con lo que **la mitad «la pila está mal» del reporte
   del humano no queda guardada por ninguna aserción con señal de producción**.
   La corrección es barata: restaurar el cuerpo del test a la versión de
   `c231651a` (`git show c231651a -- <ese fichero>`), que ya asevera
   `app.getPathname()` y `router.canGoBack()` contra expo-router real.
   Lo dejo como recomendación y no como rechazo porque la mitad «destino» sí
   falla de verdad contra el código anterior, y porque tengo prueba directa de
   que la pila real que produce el arreglo es la correcta.

2. **(contexto, sin acción) Arranque en frío estando deslogueado.** Si la app se
   abre en frío desde una notificación **sin sesión**, `index.tsx` redirige a
   `/login`, el pathname deja `/` con `pushReady` aún en `false`, y el efecto
   vuelve a dispararse al autenticar (por `status`/`token` en sus deps) cuando el
   pathname todavía es `/login`. Queda fuera del escenario de R10 y del paso 8
   del smoke; lo anoto por si reaparece.

## Lo que sigue

El humano repite en el dev build de Android el **paso 8** de R12 (app matada →
tap en la notificación → debe abrir el centro de alertas, y **una** pulsación de
atrás debe llevar a Home). Los pasos 1-7 ya pasaron y solo hacen falta como
regresión si algo del entorno cambió. Hasta esa firma, R12 y la feature siguen
`in_progress`.

## Output de `./init.sh`

```
$ pgrep -af "init.sh|jest"     # nada corriendo
$ ./init.sh                    # sin pipe
EXIT=0

→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible
✅ bun disponible
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
→ Instalando dependencias...
✅ Dependencias instaladas
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
✅ STATUS.md sincronizado con feature_list.json
→ Build...
✅ Build exitoso
→ Ejecutando tests...
Test Suites: 170 passed, 170 total        (backend)
Tests:       1295 passed, 1295 total
Test Suites: 2 passed, 2 total            (infraestructura)
Tests:       14 passed, 14 total
Test Suites: 77 passed, 77 total          (móvil)
Tests:       1348 passed, 1348 total
Snapshots:   1 passed, 1 total
✅ Tests pasados
→ Tests e2e...
✅ Esquema y recursos e2e listos
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 384 passed, 392 total
✅ Tests e2e pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 85/101 completadas | 15 pendientes

  Próxima feature:
  [#18] nutrition-ai-explainer (P3)
```

Avisos no bloqueantes conservados: falta local de `RESEND_API_KEY`,
`RESEND_FROM` y `RESET_LINK_HOST`; aviso del AWS SDK sobre Node >= 22 (el VPS
corre v20.20.2). Ninguno aborta el gate.
