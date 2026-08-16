---
feature: "init-env-drift-warning"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[init-env-drift-warning]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## Reglas duras de ejecución

1. **Test primero, commits separados.** Cada requisito cierra con al menos dos
   commits: uno con el test en rojo y otro con la implementación que lo pone
   verde. Un único commit con test + implementación + docs incumple C4 de
   [[../../CHECKPOINTS|CHECKPOINTS]] y el `reviewer` lo rechaza (pasó en #19).
2. **Nombre del test = R-id.** `describe('R<n> (init-env-drift-warning #23): ...')`,
   igual que el resto del repo (`docs/verification.md` §Disciplina TDD).
3. **[[traceability]] se actualiza en el mismo commit** que pone verde cada
   requisito, no al final.
4. **Nada de código de la aplicación.** `backend-pet-tracker/` e `infra/` no se
   tocan en esta feature. Si algo parece exigirlo, **para y reporta**.
5. **Si la spec no cuadra con la realidad del repo, para y reporta** en
   `progress/impl_init-env-drift-warning.md` en vez de improvisar una
   interpretación (precedente #27: Codex paró en R4 y tenía razón).
6. Correr la suite con `node --test env-drift.test.mjs` desde la raíz del repo.

## T0 — Capturar la línea base de la §2 (prerrequisito de R9)

**Antes de editar `init.sh`**, con un `.env` cualquiera:

- [ ] `./init.sh 2>&1 | sed -n '/→ Verificando variables de entorno/,/→ Instalando dependencias/p' > /tmp/env-section-antes.txt`
- [ ] Pegar el contenido de ese archivo en `progress/impl_init-env-drift-warning.md`
      (es la referencia contra la que se compara al final; sin esto R9(b) no
      se puede verificar a posteriori)

## R1 — `parseEnvKeys` aplica las reglas de parseo (comentarios, CRLF, BOM, espacios)

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — `missingKeys` solo reporta example → env, ordenado y sin duplicados

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — `formatDriftLines` separa gates `*_ENABLED` de configuración, formato literal

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Sin deriva, cero bytes en stdout y exit 0

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — Sin `.env.example` (o sin `.env`) el script calla y sale 0

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — El script nunca escribe en disco

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — `init.sh` invoca el chequeo en §2 y lo imprime con `warn()`

- [ ] (1) Escribir test que falla para R7 (inspección de fuente de `init.sh`)
- [ ] (2) Implementación mínima que lo pasa (insertar el bloque literal de R7)
- [ ] (3) Refactor con tests verdes

## R8 — El aviso no aborta: sin `fail`, sin `exit`, sobrevive a `set -e`

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Sin deriva, la §2 no cambia ni un byte

- [ ] (1) Escribir test que falla para R9 (assertion estática de (a))
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes
- [ ] (4) Ejecutar el `diff` de R9(b) contra `/tmp/env-section-antes.txt` de T0
      **con un `.env` sin claves faltantes** y pegar el resultado (vacío) en
      `progress/impl_init-env-drift-warning.md`

## R10 — `TEST_CMD` ejecuta la suite; `REQUIRED_ENV_VARS` y `check_env()` intactos

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa (una línea en `init.config.sh`)
- [ ] (3) Refactor con tests verdes

## R11 — Documentación actualizada y cero variables de entorno nuevas

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa (`docs/verification.md` + `AGENTS.md`)
- [ ] (3) Refactor con tests verdes

## R12 — Verificación manual reproducible (sin test automatizado)

- [ ] (1) No aplica: R12 es el procedimiento manual, no hay test rojo
- [ ] (2) Ejecutar los 4 pasos de R12 y pegar la salida literal en
      `progress/impl_init-env-drift-warning.md` (incluido `stat -c '%Y %s' .env`
      antes y después, y el `echo $?`)
- [ ] (3) Registrar el resultado en [[traceability]] §Verificación manual

## Cierre

- [ ] `./init.sh` verde de punta a punta (incluye la suite nueva vía `TEST_CMD`)
- [ ] [[traceability]] sin ninguna fila "pendiente"
- [ ] `progress/impl_init-env-drift-warning.md` con la evidencia de T0, R9(4) y R12
