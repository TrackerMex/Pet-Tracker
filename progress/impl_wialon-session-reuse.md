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
- 2026-08-17: `R7` rojo bloqueado: se restauró el comentario de `wialon.errors.ts` a su texto original de main para no fabricar el fallo (commit `2b28add`) y mantener el `test:` de R7 honesto.
- 2026-08-17: `R7` verde (D2): assert de `@nestjs/common` cambia a `from ... from '@nestjs/common'` para validar import real (commit `7a90e1f`).
- 2026-08-17: `R7` verde (D1): mover assert de `errorSpies` antes de `finally` en `wialon-http.client.spec.ts` para que no quede inerte (commit `7f0873f`).
- 2026-08-17: `R7`: verificación adicional por defecto de regresión: se inyectó temporalmente `console.error(this.token)` en `callWithSession` y el `it` de seguridad de `R7` pasó a fallar; luego se quitó ese cambio de código.
- 2026-08-17: `R7`: se actualizaron `wialon-http.client.ts` para deduplicar import de errores y ajustar JSDoc a la forma final (`5ef90f8`).
- 2026-08-17: `R8` verde (nace como guarda de regresión): test añadido en `wialon-http.client.spec.ts` (sin cambios de código en ese bloque) — commit `3e4dfd6` *(feat(wialon-session-reuse): add R7/R8 born-green guard specs)*.
- 2026-08-17: `R9` rojo (`wialon-http.client.spec.ts`): assert anti-vacío/documentación en `docs/wialon-module.md` (commit `63c9b21`).
- 2026-08-17: `R9` verde: documentación actualizada en `docs/wialon-module.md` con cacheo por instancia, `WIALON_SID_TTL_MS` y re-login ante `1`/`1011` (commit `a2b2e2b`).
- 2026-08-17: R8(2) evidencia de no-deriva de contratos: `git diff --name-only main..HEAD -- backend-pet-tracker/src/integrations/wialon`
  - `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts`
  - `backend-pet-tracker/src/integrations/wialon/wialon-http.client.ts`
  - `backend-pet-tracker/src/integrations/wialon/wialon.errors.ts`

## Verificación final ejecutada

- `./init.sh` final: ejecutado en PowerShell sin errores (exit code 0).
- `pnpm -C backend-pet-tracker test`: 139 suites, 1045 tests.
- `pnpm -C backend-pet-tracker test -- src/integrations/wialon/wialon-http.client.spec.ts`: 23 tests.
- `pnpm -C backend-pet-tracker test -- src/workers/poller.service.spec.ts -t "R2 (wialon-session-reuse #29)"`: verde.
