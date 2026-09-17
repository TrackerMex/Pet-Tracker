# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #79 — mobile-push-registration (P2)

- **Rama**: `feature/79-mobile-push-registration`, creada desde `origin/main` en 29689598 (merge de #139, cierre de #72).
- **Sesion**: Frontend. La sesion Backend trabaja #90 `mobile-owner-timezone-dates` en su worktree. Las dos features son moviles y **ambas pueden tocar `src/i18n/catalog.ts`**: ese es el punto de colision de esta ronda. Acuerdo vigente: quien vaya a anadir claves lo anuncia en cuanto su spec lo sepa, y el segundo en mergear actualiza el numero conservando la suma visible.
- **Estado**: `in_progress` desde el 2026-09-17. Spec firmada por el humano ese dia (e6c0a722), incluidas las tres decisiones cerradas (C1, C2, R5) y las dos tareas humanas. Handoff a Codex CLI entregado.
- **Plan que implementa Codex**: R1 declara `expo-notifications@~57.0.12` con su candado; R2 mete el config plugin y el permiso de Android en `app.json`; R3 y R4 el cliente HTTP, incluido el `body` opcional de `deleteJson`; R5 el `DELETE` antes de borrar la sesion; R6 a R9 el hook de registro (guarda de dev build, permiso sin insistir, token y POST, y que ningun fallo bloquee el login); R10 el handler de tap a `/alerts`; R11 el montaje en `_layout.tsx`; R12 el gate humano.
- **Pendiente real que puede frenar el gate**: la Tarea A esta firmada pero `extra.eas.projectId` **no esta en `app.json`** (el arbol no tiene bloque `extra`). `eas.json` si existe, pero es de #mobile-ui-foundation R7, no de este `eas init`. Sin ese id el codigo no puede pedir el token y el smoke de R12 no se puede correr; la implementacion si puede avanzar porque los tests mockean `expo-constants`.

### Por que no hubo explorer

La entrada de la feature ya trae el alcance en cinco puntos y varias decisiones cerradas, y el contrato del backend existe desde #13 (`POST`/`DELETE /v1/me/push-tokens`, con su validacion de formato del token). Lo que falta no es investigacion: es convertirlo en requisitos trazables y verificar las firmas de `expo-notifications` contra los docs versionados del SDK 57.

### Lo que bloquea el cierre, y lo sabe el humano

`getExpoPushTokenAsync` exige un `projectId` de EAS y `app.json` no tiene `extra` siquiera. Hacen falta dos tareas humanas previas: `eas init` (gratis, cuenta Expo) y credenciales **FCM V1** en EAS. Sin eso la feature se implementa pero no se puede cerrar, porque el gate es un smoke en **dev build de Android** — Expo Go no soporta push desde SDK 53.

### Estado verificado del arbol al arrancar

- `expo` en `~57.0.14`; **no existe** `expo-notifications`.
- `app.json`: plugins `expo-router`, `expo-splash-screen`, `expo-secure-store`. **Sin bloque `extra`**, o sea sin `extra.eas.projectId`. `android.package` = `com.trackermex.pettracker`, sin `googleServicesFile` ni permisos declarados.
