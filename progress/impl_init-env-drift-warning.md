# Implementación — init-env-drift-warning (#23)

## T0 — Línea base de `init.sh` §2

Comando ejecutado antes de editar `init.sh`:

```bash
./init.sh 2>&1 | sed -n '/→ Verificando variables de entorno/,/→ Instalando dependencias/p' > /tmp/env-section-antes.txt
```

Contenido capturado:

```text
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida

→ Instalando dependencias...
```

## Decisiones de implementación

- R7, R8 y R9 dependen del mismo bloque literal de `init.sh`. Para conservar
  un rojo propio por requisito antes de esa implementación compartida, sus
  tests se commitean por separado y el bloque se inserta después de los tres.
- En esta máquina, `bash` sin ruta resuelve a WSL y no encuentra `node`. Las
  verificaciones se ejecutaron con `C:\Program Files\Git\bin\bash.exe`, que es
  el entorno objetivo de la spec.

## R9(b) — Sección sin deriva

Se ejecutó `init.sh` desde una copia temporal mínima, con `.env` copiado de
`.env.example`, para no modificar ni reemplazar el `.env` humano. Salida de
`/tmp/env-section-despues.txt`:

```text
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida

→ Instalando dependencias...
```

Salida literal de
`diff /tmp/env-section-antes.txt /tmp/env-section-despues.txt` (exit 0,
stdout de 0 bytes):

```text
```

## R12 — Verificación manual

### R12.1 — Aviso con el `.env` incompleto

Salida literal de §2:

```text
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 8 claves de .env.example
⚠️    gates ausentes (apagan features enteras en silencio): ACTIVITY_AGGREGATOR_ENABLED, ALERTS_ENGINE_ENABLED, EMAIL_ENABLED, PUSH_ENABLED
⚠️    configuración ausente: AWS_MODE, SIM_HOME_LAT, SIM_HOME_LNG, SIM_SEED
⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example

→ Instalando dependencias...
```

### R12.2 — `.env` sin modificar

```text
$ stat -c '%Y %s' .env
1786743239 895
$ ./init.sh
$ stat -c '%Y %s' .env
1786743239 895
$ git status --short
?? .agents/
?? .codex/
?? skills-lock.json
```

Los tres paths no versionados ya existían al iniciar la sesión. `.env` no
aparece en `git status` y su mtime/tamaño son idénticos antes y después.

### R12.3 — Exit code y suite vía `TEST_CMD`

Salida literal relevante de `./init.sh; echo $?`:

```text
▶ R11 (init-env-drift-warning #23): documentacion y cero variables nuevas
  ✔ documenta la verificacion manual
  ✔ añade env-drift.mjs al mapa del repositorio
  ✔ no añade variables de entorno
✔ R11 (init-env-drift-warning #23): documentacion y cero variables nuevas
ℹ tests 28
ℹ suites 11
ℹ pass 28
ℹ fail 0
✅ Tests pasados
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
0
```

### R12.4 — `.env` completo

Ver §R9(b): la copia temporal completa no produjo warnings y el `diff` fue
vacío. El `.env` humano no se editó, reemplazó ni renombró.

## Commits que cierran cada requisito

| Requisito | Commit verde |
|---|---|
| R1 | `2a1a94c feat(init-env-drift-warning): parse env keys (R1)` |
| R2 | `5f9c1a5 feat(init-env-drift-warning): report missing env keys (R2)` |
| R3 | `7f85092 feat(init-env-drift-warning): format drift warnings (R3)` |
| R4 | `15e188b feat(init-env-drift-warning): add silent drift CLI (R4)` |
| R5 | `aeef03d feat(init-env-drift-warning): ignore unreadable env files (R5)` |
| R6 | `2ba4ccc feat(init-env-drift-warning): use read-only filesystem access (R6)` |
| R7 | `4f738d5 feat(init-env-drift-warning): warn about env key drift (R7,R8,R9)` |
| R8 | `4f738d5 feat(init-env-drift-warning): warn about env key drift (R7,R8,R9)` |
| R9 | `4f738d5 feat(init-env-drift-warning): warn about env key drift (R7,R8,R9)`; manual `5f583b4` |
| R10 | `cdd1343 feat(init-env-drift-warning): run drift suite from init (R10)` |
| R11 | `9a1c23d docs(init-env-drift-warning): document manual verification (R11)` |
| R12 | `ed23bbe docs(init-env-drift-warning): record manual verification (R12)` |
