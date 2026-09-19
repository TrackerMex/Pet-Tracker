# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #79 — mobile-push-registration (P2)

- **Rama**: `feature/79-mobile-push-registration`, creada desde `origin/main` en 29689598 (merge de #139, cierre de #72).
- **Sesion**: Frontend. La sesion Backend trabaja #90 `mobile-owner-timezone-dates` en su worktree. Las dos features son moviles y **ambas pueden tocar `src/i18n/catalog.ts`**: ese es el punto de colision de esta ronda. Acuerdo vigente: quien vaya a anadir claves lo anuncia en cuanto su spec lo sepa, y el segundo en mergear actualiza el numero conservando la suma visible.
- **Estado**: `in_progress` desde el 2026-09-17. R1-R11 implementados y verificados; R12 queda pendiente del gate humano.
- **Plan que implementa Codex**: R1 declara `expo-notifications@~57.0.19` con su candado; R2 mete el config plugin y el permiso de Android en `app.json`; R3 y R4 el cliente HTTP, incluido el `body` opcional de `deleteJson`; R5 el `DELETE` antes de borrar la sesion; R6 a R9 el hook de registro (guarda de dev build, permiso sin insistir, token y POST, y que ningun fallo bloquee el login); R10 el handler de tap a `/alerts`; R11 el montaje en `_layout.tsx`; R12 el gate humano.
- **Pendiente real que puede frenar el gate**: la Tarea A esta firmada pero `extra.eas.projectId` **no esta en `app.json`** (el arbol no tiene bloque `extra`). `eas.json` si existe, pero es de #mobile-ui-foundation R7, no de este `eas init`. Sin ese id el codigo no puede pedir el token y el smoke de R12 no se puede correr; la implementacion si puede avanzar porque los tests mockean `expo-constants`.

### Por que no hubo explorer

La entrada de la feature ya trae el alcance en cinco puntos y varias decisiones cerradas, y el contrato del backend existe desde #13 (`POST`/`DELETE /v1/me/push-tokens`, con su validacion de formato del token). Lo que falta no es investigacion: es convertirlo en requisitos trazables y verificar las firmas de `expo-notifications` contra los docs versionados del SDK 57.

### Lo que bloquea el cierre, y lo sabe el humano

`getExpoPushTokenAsync` exige un `projectId` de EAS y `app.json` no tiene `extra` siquiera. Hacen falta dos tareas humanas previas: `eas init` (gratis, cuenta Expo) y credenciales **FCM V1** en EAS. Sin eso la feature se implementa pero no se puede cerrar, porque el gate es un smoke en **dev build de Android** — Expo Go no soporta push desde SDK 53.

### Estado verificado del arbol al arrancar

- `expo` en `~57.0.14`; **no existe** `expo-notifications`.
- `app.json`: plugins `expo-router`, `expo-splash-screen`, `expo-secure-store`. **Sin bloque `extra`**, o sea sin `extra.eas.projectId`. `android.package` = `com.trackermex.pettracker`, sin `googleServicesFile` ni permisos declarados.

### Ejecución Codex (2026-09-17)

- Worktree correcto confirmado: `/home/claude/sites/Pet-Tracker`, branch `feature/79-mobile-push-registration`, árbol limpio al arrancar.
- `./init.sh` inicial verde: backend 170 suites / 1295 tests, móvil 73 suites / 1286 tests, e2e 27 suites / 384 tests; build, lint y typecheck verdes.
- La skill solicitada `expo-overview` no está instalada en el plugin Expo 1.0.2 disponible; se usa como fuente de verdad la documentación oficial versionada de SDK 57.
- Firmas verificadas en `https://docs.expo.dev/versions/v57.0.0/sdk/notifications/`: handler de cuatro campos, canal Android, permisos, token con `projectId`, listener con `.remove()` y respuesta inicial. `getLastNotificationResponseAsync()` existe en v57 aunque la referencia ya recomienda su reemplazo síncrono; la implementación conserva el método exigido por R10.
- R1 rojo confirmado y guardado en `a4f0bc8c`: el test esperaba `~57.0.12` y recibió `undefined`.
- **Bloqueo R1**: el 2026-09-17, `npx expo install expo-notifications` resolvió e instaló `~57.0.19`, no el `~57.0.12` fijado por la spec. `tasks.md` ordena parar si el CLI escribe otra versión y prohíbe corregirla a mano, así que no se avanzó a R2. Quedan sin commit los cambios generados por el CLI en `mobile-pet-tracker/package.json` y `mobile-pet-tracker/bun.lock`, a la espera de que el humano actualice/confirme la versión aprobada.

### Nota sobre los comandos citados aqui

Cualquier comando con `npx` que aparezca en este fichero es **cita historica** de
lo que se ejecuto en su momento. La norma vigente desde el 2026-09-17 es **bun**
para todo en `mobile-pet-tracker/` (`bun add`, `bunx expo install`, `bunx jest`,
`bunx tsc --noEmit`, `bunx <cli>@latest`), escrita en `docs/conventions.md`
§Convenciones de la app movil.

### Reanudación y cierre de R1-R11 (2026-09-17)

- La enmienda E1 dejó el rango aprobado en `~57.0.19`; `b1204355` conserva el
  `package.json` y el `bun.lock` generados por el instalador. R1-R11 siguieron
  TDD requisito por requisito y sus hashes quedaron en `traceability.md`.
- Verificación final verde: `bunx jest` (75 suites, 1326 tests, 1 snapshot),
  `bunx tsc --noEmit`, `bun run lint` y `./init.sh`. El gate completo incluyó
  backend (170 suites / 1295 tests), infraestructura (2 / 14), móvil
  (75 / 1326) y e2e (27 suites / 384 tests pasados; 3 / 8 omitidos).
- El delta de i18n es cero y ninguno de los ficheros prohibidos por la spec
  aparece en el diff de implementación.
- R12 no se ejecutó. Aunque las tareas A y B figuran marcadas en la spec,
  `mobile-pet-tracker/app.json` no contiene `extra.eas.projectId`; el hook
  degrada sin registrar por R6. El detalle queda en
  `progress/impl_mobile-push-registration.md` §R12.

## Gate humano de #79 — resultado del 2026-09-19: RECHAZADO en el paso 8

Recorrido por el humano en dev build de Android sobre telefono fisico.

**Pasos que PASAN** (no hay que repetirlos salvo como regresion): 1 prebuild con
el permiso en el manifiesto; 2 login y permiso concedido; 3 la fila aparece en
`push_tokens` con `ExpoPushToken[...]` y `platform = android`; 5 la alerta se
encola (se uso la ruta determinista de la spec, encolando el mensaje de 7 claves
en `notifications`, porque el pipeline del motor tardaba); 6 banner en primer
plano; **7 tap en segundo plano termina en el centro de alertas**.

**Paso 8 FALLA**: con la app **matada**, tocar la notificacion abre la app pero
**se queda en Home**, no navega a alertas. Ademas el boton atras se comporta mal:
una pulsacion lleva a Home otra vez y hacen falta dos para salir, lo que indica
que la pila no es la que deberia.

**Mecanismo, con la evidencia que lo acota**: que el paso 7 SI funcione descarta
que `router.push('/alerts')` este roto en general, y deja el defecto en el camino
de arranque en frio. `src/app/index.tsx:11` devuelve `<Redirect href="/home" />`
cuando hay sesion; en arranque en frio el hook resuelve
`getLastNotificationResponseAsync()` y hace su `router.push('/alerts')`, pero ese
redirect declarativo se aplica despues o a la vez y se lleva por delante la
navegacion. Es una carrera entre una navegacion imperativa lanzada desde un
efecto y un redirect declarativo del router.

**Por que los tests no lo vieron**: el test de R10 monta el hook aislado y
verifica que se llama a `router.push`, no que la navegacion sobreviva al redirect
de arranque. La llamada ocurre; lo que no ocurre es el resultado.

R10 **no cambia**: ya exige que el tap navegue a alertas con la app cerrada. Esto
es un defecto contra R10, no una enmienda. Vuelve a Codex.

