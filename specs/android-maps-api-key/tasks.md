---
feature: "android-maps-api-key"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[android-maps-api-key]]

> Disciplina TDD (CHECKPOINTS C4): cada requisito con commit rojo→verde
> explícito — el test rojo se commitea ANTES que la implementación que lo
> pasa. Nada de "todo en un commit". Ver [[requirements]] para el detalle
> de cada R y [[design]] para las decisiones D1–D8.
>
> Antes de empezar: cargar la skill `expo:expo-overview` (regla de
> `docs/ui-guidelines.md`; en Codex CLI, el plugin `expo`) y trabajar desde
> `mobile-pet-tracker/` con `bun`. Todos los comandos de test:
> `bun run --cwd mobile-pet-tracker test`.

## R1 — La config resuelta inyecta la clave desde el entorno

- [x] (1) Escribir test que falla para R1: `mobile-pet-tracker/app.config.test.ts`
      (NUEVO) → `describe('R1: la config resuelta inyecta la clave de
      Android desde el entorno', ...)`. Importa el default export de
      `./app.config` y `./app.json`, invoca con `{ config: appJson.expo }`
      y assertea la tupla `['react-native-maps', { androidGoogleMapsApiKey:
      'test-key' }]` al final de `plugins`, la conservación de las claves
      de `app.json` (§R1 lista a/b) y el `trim`. Rojo por módulo
      inexistente.
- [x] (2) Implementación mínima que lo pasa: `mobile-pet-tracker/app.config.ts`
      ([[design]] §D1, §D2 — ojo con las dos trampas de tipos de D2).
- [x] (3) Refactor con tests verdes + `bun run typecheck` y `bun run lint`
      verdes (el archivo nuevo entra en ambos).

## R2 — Sin la variable: aviso explícito, sin plugin y sin lanzar

- [x] (1) Escribir test que falla para R2 (mismo archivo): ausente / `''` /
      `'   '` → `plugins` igual al de `app.json`, `not.toThrow()`, un solo
      `console.warn` con los substrings `GOOGLE_MAPS_API_KEY_ANDROID` y
      `docs/verification.md`. Restaurar `process.env` entre casos.
- [x] (2) Implementación mínima que lo pasa ([[design]] §D4).
- [x] (3) Refactor con tests verdes.

## R3 — La clave viaja por entorno, nunca por el repo

- [x] (1) Escribir test que falla para R3 (mismo archivo): lee
      `.env.example` y assertea `/^GOOGLE_MAPS_API_KEY_ANDROID=\s*$/m`,
      ausencia de `EXPO_PUBLIC_GOOGLE` y ausencia de `/AIza[0-9A-Za-z_-]{10,}/`.
- [x] (2) Implementación mínima que lo pasa: línea + comentario en
      `mobile-pet-tracker/.env.example` (D3). Verificar —sin modificarlo—
      que `mobile-pet-tracker/.gitignore` ya ignora `.env`.
- [x] (3) Refactor con tests verdes.

## R4 — `docs/verification.md` §Feature 52

- [x] (1) No hay test posible (documentación): el "rojo" verificable es la
      ausencia de la sección — `grep -n "Feature 52" docs/verification.md`
      vacío antes de escribirla.
- [x] (2) Escribir `### Feature 52 — android-maps-api-key` tras la sección
      de Feature 51, con los seis pasos literales de [[requirements]] R4
      (prebuild inicial → SHA-1 con `gradlew signingReport` / `keytool
      -J-Duser.language=en` → clave restringida en Google Cloud → `.env`
      → prebuild + `grep` del manifest + `run:android` → smoke R6) y la
      nota de EAS Build de [[design]] §D6.
- [x] (3) Releer con el `grep` del paso anterior: la sección aparece y
      ningún comando quedó parafraseado.

## R5 — Regresión y contención

- [x] (1) No hay test propio: el "rojo" es la lista de comandos por
      ejecutar, anotada en `progress/impl_android-maps-api-key.md`.
- [x] (2) Ejecutar y registrar salida: `bun run --cwd mobile-pet-tracker
      typecheck`, `lint`, `test`, y `./init.sh` desde la raíz — los cuatro
      exit 0, sin tests previos modificados.
- [x] (3) Verificar contención con `git diff --stat main...HEAD` contra la
      allowlist de [[requirements]] R5 (y confirmar que `app.json`,
      `eas.json`, `package.json`, `bun.lock`, `src/**` y
      `backend-pet-tracker/**` no aparecen); anotar el resultado en
      `progress/impl_android-maps-api-key.md`.

## R6 — Smoke en el dev build de Android (cierre humano)

- [x] (1) Preparar: dejar en `progress/impl_android-maps-api-key.md` el
      guion de R6 listo para que el humano lo siga (comandos copiables,
      qué mirar en `adb logcat`, qué hacer si el mapa sale gris).
- [ ] (2) **HUMANO**: crear la clave en Google Cloud restringida por
      `com.trackermex.pettracker` + SHA-1, ponerla en
      `mobile-pet-tracker/.env`, `npx expo prebuild --clean --platform
      android`, `grep -c "com.google.android.geo.API_KEY" …/AndroidManifest.xml`
      = 1, `bunx expo run:android`, y recorrer los pasos 2–5 de
      [[requirements]] R6.
- [ ] (3) **HUMANO**: registrar el resultado en
      `progress/impl_android-maps-api-key.md` (sin pegar la clave) y marcar
      la segunda casilla de [[requirements]] §Aprobación — sin eso la
      feature NO pasa a `done`, y el gate R9 de #45 `pet-lost-mode` sigue
      bloqueado.
