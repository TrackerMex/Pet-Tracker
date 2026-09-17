# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #79 — mobile-push-registration (P2)

- **Rama**: `feature/79-mobile-push-registration`, creada desde `origin/main` en 29689598 (merge de #139, cierre de #72).
- **Sesion**: Frontend. La sesion Backend trabaja #90 `mobile-owner-timezone-dates` en su worktree. Las dos features son moviles y **ambas pueden tocar `src/i18n/catalog.ts`**: ese es el punto de colision de esta ronda. Acuerdo vigente: quien vaya a anadir claves lo anuncia en cuanto su spec lo sepa, y el segundo en mergear actualiza el numero conservando la suma visible.
- **Estado**: `pending`, sin spec. Lanzado el `spec_author` el 2026-09-17.

### Por que no hubo explorer

La entrada de la feature ya trae el alcance en cinco puntos y varias decisiones cerradas, y el contrato del backend existe desde #13 (`POST`/`DELETE /v1/me/push-tokens`, con su validacion de formato del token). Lo que falta no es investigacion: es convertirlo en requisitos trazables y verificar las firmas de `expo-notifications` contra los docs versionados del SDK 57.

### Lo que bloquea el cierre, y lo sabe el humano

`getExpoPushTokenAsync` exige un `projectId` de EAS y `app.json` no tiene `extra` siquiera. Hacen falta dos tareas humanas previas: `eas init` (gratis, cuenta Expo) y credenciales **FCM V1** en EAS. Sin eso la feature se implementa pero no se puede cerrar, porque el gate es un smoke en **dev build de Android** — Expo Go no soporta push desde SDK 53.

### Estado verificado del arbol al arrancar

- `expo` en `~57.0.14`; **no existe** `expo-notifications`.
- `app.json`: plugins `expo-router`, `expo-splash-screen`, `expo-secure-store`. **Sin bloque `extra`**, o sea sin `extra.eas.projectId`. `android.package` = `com.trackermex.pettracker`, sin `googleServicesFile` ni permisos declarados.
