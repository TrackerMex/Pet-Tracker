# Implementación — mobile-auth (#33)

- Fecha: 2026-08-21
- Branch: `feature/33-mobile-auth`
- Alcance de Codex: R1-R10
- Estado: R1-R10 implementados y verificados; R11 queda pendiente del smoke
  humano con Expo Go en Android físico.

## Resultado

- `src/api/auth.ts` implementa Login y Register como funciones puras con
  `fetchFn` inyectable, URL saneada y estados discriminados por `kind`.
  `src/api/types.ts` conserva tipos escritos a mano según D10; no se añadió
  codegen OpenAPI.
- `AuthProvider` restaura, persiste y elimina `auth_token` exclusivamente con
  `expo-secure-store@~57.0.1`. No existe ningún import de SecureStore bajo
  `src/api/`.
- La pantalla health de #32 se movió a `/health` sin cambios de
  comportamiento. El componente fue detectado como rename 100% y su suite
  como rename 98% por el único cambio de import.
- `/` es ahora el splash: muestra `splash-icon.png` mientras restaura sesión y
  redirige a `/health` o `/login`. El layout raíz conserva
  `GestureHandlerRootView > HeroUINativeProvider` y añade
  `AuthProvider > Stack` sin headers.
- Login consume el contrato real `POST /v1/auth/login`, persiste el token y
  presenta mensajes específicos para todos los `kind`.
- Register refleja el DTO real del backend, bloquea el submit hasta aceptar
  términos, normaliza el país, obtiene el timezone del dispositivo, distribuye
  errores por campo y encadena auto-login con fallback a `/login`.
- Forgot es un stub estático y deshabilitado. No importa ni llama APIs; el
  backend de recuperación permanece fuera de alcance en la feature #44.
- La instalación oficial de Expo añadió la dependencia, su lockfile y el
  plugin `expo-secure-store` a `app.json`; no se inició ningún dev build.

## Evidencia TDD y commits de implementación

| R-id | Rojo | Verde / implementación |
|---|---|---|
| R1/R2 | `93c5257` | `a4b3841` |
| R3/R4 | `f33103f` | `1008107` |
| R6 | excepción de mudanza aprobada | `5102370` |
| R5 | `26aa7f1` | `fdd96b1` |
| R7 | `4cdb79a` | `e51e972` |
| R8 | `3d2de99` | `765ec59` |
| R9 | `3fe20ae` | `4b0c78c` |

Cada commit rojo precede al verde correspondiente. R6 usa la excepción C4
documentada en la spec para una mudanza mecánica.

## Verificación R10

- Suite móvil completa: 9 suites, 59 tests, todos verdes.
- `./init.sh`: exit 0.
  - backend: 143 suites, 1111 tests;
  - infra: 2 suites, 14 tests;
  - harness env drift: 11 suites, 28 tests;
  - móvil: 9 suites, 59 tests;
  - build, lint y typecheck: verdes.
- E2E: omitidos por el harness porque LocalStack no respondía en el puerto
  4566; mobile-auth no requiere AWS y no se levantaron recursos reales.
- Contención:
  `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  devolvió salida vacía.
- Greps de reviewer: sin `StyleSheet` ni colores hex en los componentes nuevos;
  sin `expo-secure-store` en `src/api/`.

## Pendiente humano

- R11: ejecutar exactamente el smoke de `requirements.md` con
  `bunx expo start --go` sobre Android físico. Codex no inició Expo Go,
  emuladores ni development builds.
- Después del smoke corresponde lanzar `reviewer`; la feature permanece
  `in_progress` y no se marca `done` antes de esos gates.

## Estado del worktree

Los cambios locales preexistentes en `.gitignore`, modos de `init.sh` y
`init.config.sh`, `.agents/`, skills y `skills-lock.json` se preservaron y no
se incluyeron en los commits de mobile-auth.
