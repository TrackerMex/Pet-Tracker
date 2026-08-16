# Handoff a Codex CLI — feature #23 `init-env-drift-warning`

> Escrito por el `leader` el 2026-08-16, tras la aprobación humana de la spec.
> El humano copia el bloque de abajo en su terminal de Codex CLI.
> Handoff por disco: nada de contenido entre las dos IAs por chat.

---

## Prompt

```
Feature: init-env-drift-warning (#23), branch: feature/23-init-env-drift-warning
Spec aprobada por humano el 2026-08-16: specs/init-env-drift-warning/requirements.md (status: approved)
Lee también, completos y antes de escribir nada:
  - specs/init-env-drift-warning/design.md
  - specs/init-env-drift-warning/tasks.md   <- el orden de trabajo sale de aquí
  - specs/init-env-drift-warning/traceability.md

La branch ya existe y ya está activa. No la crees, no cambies de branch, no
mergees, no abras PR: el PR lo abre el leader al cierre.

Archivos a crear:
  - env-drift.mjs        (raíz del repo)
  - env-drift.test.mjs   (raíz del repo)
Archivos a modificar:
  - init.sh              (solo el bloque de la §2 VARIABLES DE ENTORNO)
  - init.config.sh       (una línea: añadir la suite a TEST_CMD)
  - docs/verification.md
  - AGENTS.md
  - specs/init-env-drift-warning/traceability.md
  - progress/impl_init-env-drift-warning.md   (lo creas tú, es tu reporte)

Fuera de alcance, no los toques: backend-pet-tracker/ e infra/. Esta feature no
tiene código de aplicación. Si algo parece exigirlo, PARA y reporta.

Qué se construye, en una frase: un diff de CLAVES (nunca de valores) entre
.env.example y .env que imprime un warning listando las que faltan, con los
gates *_ENABLED destacados en lista aparte, sin escribir en disco y sin abortar.

## Reglas críticas

- TDD por requisito, UN COMMIT POR REQUISITO COMO MÍNIMO, con el test rojo en un
  commit ANTERIOR al de su implementación. Un único commit con test +
  implementación + docs incumple C4 de CHECKPOINTS.md y el reviewer lo rechaza.
  Ya pasó en #19; no se repite. El historial rojo→verde es el entregable, no un
  detalle de estilo.
- Nombre del test = R-id: describe('R<n> (init-env-drift-warning #23): ...').
- specs/init-env-drift-warning/traceability.md se actualiza EN EL MISMO COMMIT
  que pone verde cada requisito, no al final.
- Suite: node --test env-drift.test.mjs desde la raíz del repo. Solo stdlib de
  node. Prohibidos comm/sort/awk/sed/grep -f/jq/nc/lsof: init.sh corre en Git
  Bash sobre Windows y en los runners de CI.
- Convenciones de docs/conventions.md; disciplina de test de docs/verification.md.
- No crear recursos AWS reales ni correr cdk deploy.
- Si la spec no cuadra con la realidad del repo, PARA y reporta en
  progress/impl_init-env-drift-warning.md en vez de improvisar una
  interpretación. Precedente #27: Codex paró en R4 y tenía razón.

## T0 es un prerrequisito con orden estricto

Antes de tocar init.sh, captura la línea base de la §2 tal como manda T0 de
tasks.md y pega el resultado en tu reporte. Si editas init.sh primero, R9(b)
deja de ser verificable y hay que rehacer el trabajo.

Nota de entorno para correr ./init.sh: la infra local debe estar arriba
(docker compose up -d). Si LocalStack se reinició, sus recursos se pierden y los
e2e fallan con NoSuchBucket; se rehacen con `pnpm run provision:local` desde
backend-pet-tracker/. Eso no es una regresión de esta feature.

## Aviso sobre el .env de esta máquina (afecta a R9(4) y a R12)

El .env real de la máquina arrastra hoy 8 claves faltantes respecto de
.env.example, 4 de ellas gates. Eso es exactamente el defecto que #23 hace
visible, así que sirve de caso vivo para R12.

Pero R9(4) exige lo contrario: un .env SIN claves faltantes. NO edites ni
sobrescribas el .env del humano para conseguirlo: contiene credenciales reales
de Wialon y valores que no están en .env.example. Usa una copia temporal o el
mecanismo que fije la spec. Si la spec no lo resuelve, PARA y pregunta — no
improvises sobre ese archivo.

## Criterios de aceptación: R1..R12 de requirements.md

  R1  parseEnvKeys aplica las reglas de parseo (comentarios, CRLF, BOM, espacios)
  R2  missingKeys solo reporta example -> env, ordenado y sin duplicados
  R3  formatDriftLines separa gates *_ENABLED de configuración, formato literal
  R4  Sin deriva, cero bytes en stdout y exit 0
  R5  Sin .env.example (o sin .env) el script calla y sale 0
  R6  El script nunca escribe en disco
  R7  init.sh invoca el chequeo en §2 y lo imprime con warn()
  R8  El aviso no aborta: sin fail, sin exit, sobrevive a set -e
  R9  Sin deriva, la §2 no cambia ni un byte
  R10 TEST_CMD ejecuta la suite; REQUIRED_ENV_VARS y check_env() intactos
  R11 Documentación actualizada y cero variables de entorno nuevas
  R12 Verificación manual reproducible (sin test automatizado)

R12 no tiene test rojo: es el procedimiento manual. Ejecútalo y pega la salida
literal, incluidos el `stat -c '%Y %s' .env` antes y después y el `echo $?`.
R6 y R12 juntos son la prueba de que init.sh no modifica .env — es la garantía
central de la feature, no la despaches con una assertion de conveniencia.

## Al terminar

Escribe progress/impl_init-env-drift-warning.md con: qué commit cierra cada
R-id, la evidencia de T0, el diff vacío de R9(4), la salida literal de R12, y
cualquier decisión que hayas tenido que tomar por tu cuenta. ./init.sh debe
quedar verde de punta a punta, incluida la suite nueva vía TEST_CMD.

No marques la feature como done ni toques feature_list.json: eso lo cierra el
leader tras el veredicto del reviewer.
```

---

## Después del handoff (para el leader, no para Codex)

1. Esperar a que el humano confirme que Codex terminó.
2. Leer `progress/impl_init-env-drift-warning.md`.
3. Lanzar `reviewer` contra CHECKPOINTS.md (C2..C7), la spec y la traceability.
4. Solo con veredicto aprobado: `status: "done"`, STATUS.md, cierre de sesión y PR.
