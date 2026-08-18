# Implementacion nutrition-ai-explainer (#18)

## Estado

Implementacion R1-R18 terminada. R19 queda pendiente por ser una prueba de humo humana con costo real.

Bloqueo de cierre: `./init.sh` falla en `env-drift.test.mjs` R11 porque compara literalmente 21 claves de `.env.example` y R4 agrega las tres claves aprobadas, por lo que recibe 24. La spec prohibe modificar `env-drift.mjs` y `env-drift.test.mjs`; no se aplico ningun workaround.

## Trazabilidad de implementacion

| Requisito | Rojo | Verde |
|---|---|---|
| R1 | `7cadd2c` | `4e615b3` |
| R2 | `7cadd2c` | `4e615b3` |
| R3 | `3dcaf3b` | `4e615b3` |
| R4 | `7cadd2c` | `8aab678` |
| R5 | `fd2153a` | `3240911` |
| R6 | `d0ac8cd` | `f15c312` |
| R7 | `6b7e21d` | `abfbd0f` |
| R8 | `05adbea` | `9907d0e` |
| R9 | `966bd38` | `3a4d9d2` |
| R10 | `37e7a46` | `b999e73` |
| R11 | `c862af4` | `b63e179` |
| R12 | `3819590` | `77e719d` |
| R13 | `736b4ab` | `3306260` |
| R14 | `07ea2ed` | `77e719d` |
| R15 | `70bd75d` | `77e719d` |
| R16 | `f8ab184` | `77e719d` |
| R17 | `20c0264` | `a1be974` |
| R18 | `08938fc` | `a2ba619` |
| R19 | Gate humano, no ejecutado | Gate humano, no cerrado |

La trazabilidad detallada, con mensajes y archivos de test, esta en `specs/nutrition-ai-explainer/traceability.md`.

## Decisiones

- El puerto usa `explain(input, result, ctx)` y `ctx` solo alimenta logs con `petId` y `planId`.
- `buildUserPrompt(input, result)` conserva dos parametros y no recibe contexto identificable.
- Se uso `max_completion_tokens`, confirmado en los tipos locales de `openai@7.5.0`; el valor sale de `NUTRITION_AI_MAX_OUTPUT_TOKENS`.
- El SDK se carga con `await import('openai')`; `maxRetries` es 0 y el timeout es 15 segundos.
- Ningun test habilita OpenAI real. El e2e fija `OPENAI_ENABLED=false` antes de crear Nest e inyecta el doble por el puerto para R13/R16/R17/R18.
- No se ejecuto R19, no se uso una clave real y no se cerro la feature.

## Verificacion

- Postgres: `5432/tcp -> 0.0.0.0:5432` y `[::]:5432`.
- Primer intento con el `bash` resuelto por PowerShell: no llego a tests porque ese entorno no tenia Node.
- Reintento con Git Bash: build backend e infra verde.
- Backend unit: 150 suites, 1144 tests, todos verdes.
- Infra: 2 suites, 14 tests, todos verdes.
- `env-drift`: 27/28 verdes; falla R11 con `24 !== 21`.
- E2e y lint del gate final no se ejecutaron porque `init.sh` se detuvo en `env-drift`.

## Bloqueo que requiere decision humana

Hay que enmendar la prohibicion de tocar `env-drift.test.mjs` o corregir externamente su asercion congelada de 21 claves. Hasta entonces no es posible cumplir simultaneamente R4, la prohibicion de archivos y `./init.sh` verde.
