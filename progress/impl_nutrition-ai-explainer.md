# Implementacion nutrition-ai-explainer (#18)

## Estado

Implementacion R1-R18 terminada, correcciones de la ronda 2 aplicadas y
`./init.sh` verde. R19 queda pendiente por ser una prueba de humo humana con
costo real.

## Ronda 2 - correccion de evidencia

| Requisito | Correccion | Commits nuevos |
|---|---|---|
| R5 | El factory usa `OPENAI_API_KEY_PENDING` | `0095561` |
| R7 | Imports del prompt en la cabecera | `a4a81d6` |
| R9 | Tres limites exportados desde el adaptador y usados por nombre | rojo `b6d05da`; verde `adb8993` |
| R10 | `message`, `finishReason` y `usage` en los cuatro degradados | rojo `5194c64`; verde `fbc694d` |
| R11 | Mensaje del proveedor y mensaje de IA deshabilitada en `warn` | rojo `0bf623f`; verde `e79e1a6` |
| R13 | E2e HTTP/Postgres real, `count(*)`, `generated_at` y `where` por `id` | `98d8ab0` |
| R16 | Dos generate reales, una fila y una llamada al explainer | `41e05e8` |
| R17 | Texto sembrado y `NULL` leidos por GET con once claves | `3e40953` |
| R18 | Texto comprobado en POST, Postgres y GET | `82b6d2e` |
| R19 | Procedimiento humano corregido, sin ejecutar el gate | `78024dd` |

La trazabilidad historica se corrigio en `e4a1b48`: R9-R16 quedaron realmente
compilables y verdes en `29e53c3`, aunque sus filas originales atribuian el
verde a commits anteriores.

## Trazabilidad de implementacion

| Requisito | Rojo | Verde |
|---|---|---|
| R1 | `7cadd2c` | `4e615b3` |
| R2 | `7cadd2c` | `4e615b3` |
| R3 | `3dcaf3b` | `4e615b3` |
| R4 | `7cadd2c` | `445ec07` |
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
- La enmienda C-4/R4 autorizo el cambio unico `21` a `24` en `env-drift.test.mjs`; commit `445ec07`. La segunda asercion del `it` y `env-drift.mjs` quedaron intactos.
- `./init.sh`: exit code 0, ejecutado con Git Bash de Windows.
- Build backend e infraestructura: verde.
- Backend unit: 150 suites, 1144 tests, todos verdes.
- Infra: 2 suites, 14 tests, todos verdes.
- `env-drift`: 11 suites, 28 tests, todos verdes.
- E2e: 20 suites y 323 tests verdes; 2 suites y 6 tests omitidos. Aparecio el log FK 23503 conocido, sin fallo de suite.
- Lint backend e infraestructura: verde.
- Typecheck: verde.
- Aviso no bloqueante: `.env` local no contiene `AWS_MODE`, `SIM_HOME_LAT`, `SIM_HOME_LNG` ni `SIM_SEED`.
- Ajustes posteriores al gate: `221c172` corrige lint y `29e53c3` alinea fixtures con los tipos de dominio.

### Ronda 2

- Docker healthy y con bindings publicados: LocalStack `4566/tcp` y Postgres
  `5432/tcp` en IPv4 e IPv6.
- La primera corrida completa con Git Bash termino en exit code 1 porque
  LocalStack no tenia sus recursos locales provisionados; los e2e devolvieron
  `ResourceNotFoundException` y uploads `404`.
- Se ejecuto `pnpm -C backend-pet-tracker run provision:local`; no se creo ni
  desplego ningun recurso AWS real.
- Segunda corrida completa de `./init.sh`: `INIT_EXIT_CODE=0`.
- Build, unitarios backend e infraestructura, `env-drift`, lint y typecheck:
  verdes.
- E2e: 20 suites y 323 tests verdes; 2 suites y 6 tests omitidos. El log mostro
  el `23503` conocido de `pet_users`, sin fallo de suite.
- `eslint --fix` no dejo cambios de contenido pendientes; las diferencias
  aparentes eran solo finales de linea y Git las normalizo al indexar.
- R19 no se ejecuto, no se uso una clave real y la feature no se cerro.
