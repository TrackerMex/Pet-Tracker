# Implementación — wialon-session-reuse (#29)

## Estado

- Branch: `feature/29-wialon-session-reuse`
- Fecha: 2026-08-17
- Orden de ejecución seguido: R6 → R1/R2 (rojos) → R1 verde → R3 → R4 → R5 → R7 → R8 → R9.
- Guardas declaradas: R7 (seguridad, nace verde), R8 (regresión, nace verde).

## Progreso

- 2026-08-17: sesión iniciada.
- 2026-08-17: `R6` rojo escrito y validado (commit `c329797`).
- 2026-08-17: `R6` verde en `WIALON_SID_TTL_MS` (commit `2d8aa6b`).
- 2026-08-17: `R1` y `R2` tests rojos (`this.session` aún no existe) (commit `b304db7`).
- 2026-08-17: `R1` verde: sesión cacheada por instancia (constante por instancia `sid` + `sidExpiresAtMs`) (commit `278018e`).
- 2026-08-17: `R3` verde: cacheo con caducidad absoluta `Date.now() < sidExpiresAtMs` (commit `c8abd6c`).
- 2026-08-17: `R4` verde: reintento de sesión inválida en `callWithSession` (commit `9102489`).
- 2026-08-17: `R5` nació verde tras R4 (sin fase roja propia), registrado con tests (`0ce9788`) + excepción en trazabilidad.
- 2026-08-17: `R2` verde: una llamada al poller con `WialonHttpClient` real inyectado hace 1 login por ciclo (impl `278018e`).
- 2026-08-17: `R7` verde (nace como guarda de seguridad): test añadido en `wialon-http.client.spec.ts` (sin cambios de código) — commit `3e4dfd6` *(feat(wialon-session-reuse): add R7/R8 born-green guard specs)*.
- 2026-08-17: `R8` verde (nace como guarda de regresión): test añadido en `wialon-http.client.spec.ts` (sin cambios de código) — commit `3e4dfd6` *(feat(wialon-session-reuse): add R7/R8 born-green guard specs)*.
- 2026-08-17: `R9` rojo (`wialon-http.client.spec.ts`): assert anti-vacío/documentación en `docs/wialon-module.md` (commit `63c9b21`).
- 2026-08-17: `R9` verde: documentación actualizada en `docs/wialon-module.md` con cacheo por instancia, `WIALON_SID_TTL_MS` y re-login ante `1`/`1011` (commit `a2b2e2b`).
- 2026-08-17: R8(2) evidencia de no-deriva de contratos: `git diff --name-only main..HEAD -- backend-pet-tracker/src/integrations/wialon`
  - `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts`
  - `backend-pet-tracker/src/integrations/wialon/wialon-http.client.ts`
  - `backend-pet-tracker/src/integrations/wialon/wialon.errors.ts`
