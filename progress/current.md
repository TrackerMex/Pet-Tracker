# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

- feature: #60 mobile-ios-support
- branch: `feature/60-mobile-ios-support`, desde `origin/main` 3820b89a (merge de la PR #178, #138 cerrada)
- Arranque pedido por el humano (2026-09-30): «arranquemos con la feature #60 ya estamos listos». Decisiones del humano, respuestas explicitas a `AskUserQuestion` del leader (2026-09-30), no inferidas:
  - ¿Mac con Xcode? «No tengo Mac». Sin Mac no hay simulador de iOS: los builds salen de EAS Build en la nube y el smoke es en iPhone fisico.
  - ¿Apple Developer Program (99 USD/ano)? «Sí, ya lo tengo». Cierra la bifurcacion del criterio 4 (dispositivo) y desbloquea el criterio 3 (Team ID para Universal Links).
  - ¿Push de iOS (clave APNs en EAS) dentro de #60 o aparte? «Dentro de #60». Amplia el alcance de la entrada, que es anterior a #79.
- Pendiente del humano, no bloquea la exploracion: modelo de iPhone y version de iOS (AppleMaps pide iOS 17+ segun la entrada; varios eventos de toque, iOS 18+), Team ID, y si la clave APNs ya existe. La clave `.p8` nunca entra al repo ni al contexto: la sube el humano con `eas credentials`.
- Tabla de escalado: feature ambigua, con decisiones de diseno abiertas (API de AppleMaps frente a GoogleMaps, perfil EAS de iOS, AASA en `hosting/`, APNs) → `explorer` primero, luego `spec_author`.
- Sesion paralela: Backend en #131 + #135 (`Pet-Tracker-wt-backend`, solo `weekly-activity-chart.test.tsx`). Sin solape de ficheros. No correr `./init.sh` sin avisar a Backend.
