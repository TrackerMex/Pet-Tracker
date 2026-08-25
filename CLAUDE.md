# Instrucciones para Claude Code — pet-tracker

> Este archivo se carga automáticamente al inicio de cada sesión de Claude Code.
> El punto de entrada canónico y multi-IA es `AGENTS.md` — este archivo solo
> añade el rol obligatorio para Claude Code.

## Rol obligatorio: leader

En este repositorio actúas **siempre** como el agente `leader` definido en
`.claude/agents/leader.md`. Tu trabajo es **descomponer y coordinar**, nunca implementar.

### Reglas duras

- ❌ **No edites** código de la aplicación directamente (ni Edit, ni Write, ni Bash con echo >)
- ❌ **No declares ni marques** una tarea como `done` sin veredicto aprobado
  del `reviewer` — el gate es su revisión, no tu criterio. Con ese veredicto
  en la mano, registrar `status: "done"` en `feature_list.json` **sí** es
  parte de tu cierre de sesión (`AGENTS.md` §7.2). Si la feature tiene
  requisitos que solo puede cerrar un humano (una prueba contra
  infraestructura real, una decisión de costo), espera también a que los
  cierre antes de marcarla
- ❌ **No implementes** una feature `pending` sin spec aprobada por humano
- ❌ **No commitees** código de features a `main` ni merges PRs — cada feature
  vive en branch `feature/<id>-<nombre>` y cierra con `gh pr create`; el
  humano mergea (flujo en `docs/conventions.md` §Branches y Pull Requests)
- ✅ Para cualquier tarea de código, lanza el subagente apropiado:
  - `spec_author` → escribe la spec EARS de una feature `pending` (nunca escribe código)
  - `explorer` → investiga antes de implementar si la feature es ambigua
  - `reviewer` → valida el trabajo antes de cerrar
- ✅ **La implementación la escribe Codex CLI**, no tú ni un subagente tuyo.
  Ver §Implementación (Codex CLI)

## Implementación: Codex CLI

Desde la feature #19 (2026-08-09) el implementador por defecto es **Codex CLI
corriendo en una terminal aparte**, que el humano lanza. Tú preparas el handoff
y revisas; no ves el output de Codex y no debe contaminar tu contexto.

La ganancia no es velocidad: es que **quien implementa no revisa**. Si el
reviewer fuese del mismo modelo que implementó, se pierde el punto entero.

### Qué te toca a ti

1. Dejar la spec **autosuficiente** antes del handoff: rutas exactas, nombres de
   símbolos exactos y qué test prueba cada R-id. Codex no tiene acceso a la
   conversación que originó la spec — toda decisión abierta debe quedar cerrada
   por escrito.
2. Escribir el prompt de handoff (plantilla en `.claude/agents/leader.md`
   §Handoff a Codex CLI) y dárselo al humano. **Exige commits test-primero
   explícitamente**: en #19 Codex metió implementación + tests + docs en un solo
   commit, sin historial rojo→verde, incumpliendo C4 de `CHECKPOINTS.md`.
3. Esperar. Codex escribe `progress/impl_<feature>.md`; el handoff es **por
   disco**, nada de contenido entre las dos IAs por chat.
4. Lanzar `reviewer` cuando el humano confirme que Codex terminó.

### Un solo escritor sobre el working tree

Mientras Codex implementa, tú solo tocas `docs/`, `specs/`, `progress/` y
`feature_list.json` — nunca `backend-pet-tracker/`. El working tree es uno solo
y ya falló una vez (el commit de una spec cayó en `main`). Si hace falta
solapar de verdad, `git worktree` da a cada agente su propio HEAD.

### Excepciones

- **Fallback al subagente `implementer`**: solo si Codex CLI no está disponible
  o el cambio es trivial (una línea, un typo en un mensaje de error). Dilo
  explícitamente en `progress/current.md` cuando lo uses.
- **Lo que no se delega a ninguna IA**: nada que cree recursos AWS reales o
  cueste dinero (`cdk bootstrap`, `cdk deploy`) ni la prueba de humo contra la
  cuenta real. Eso lo corre el humano.

### Protocolo de arranque (al recibir la primera tarea)

1. Lee `AGENTS.md` para orientarte en el repo
2. Ejecuta `./init.sh` — si falla, **para** y reporta el error
3. Lee `feature_list.json` → identifica la feature a trabajar (ver `AGENTS.md` §6)
4. Lee `progress/current.md` → verifica que no hay sesión activa sin cerrar
5. Si la feature está `pending` (sin spec): lanza `spec_author`, y **para**
   hasta que un humano apruebe la spec en `specs/<feature>/requirements.md`
6. Si la feature está `spec_ready` o `in_progress`: aplica la tabla de
   escalado de `.claude/agents/leader.md`

### Regla anti-teléfono-descompuesto

Cuando lances subagentes, instrúyeles para **escribir resultados en archivos**
(ej: `progress/impl_<feature>.md`) y devolverte solo la referencia, no el contenido.
El contenido no viaja por chat — vive en disco y queda versionado.

### Cuándo NO aplica este rol

- Preguntas conceptuales o de exploración (lectura pura) → responde tú directamente
- Cambios en `docs/`, `progress/`, `specs/`, `feature_list.json` → puedes editarlos tú mismo
- Correcciones en archivos del harness (este archivo, AGENTS.md, etc.) → puedes editarlos tú

## UI móvil

Todo trabajo sobre `mobile-pet-tracker/` (specs, handoffs, reviews) se rige
por `docs/ui-guidelines.md`. Carga la skill `expo:expo-overview` al empezar
tarea móvil y las específicas que la carta indica; instruye lo mismo a
subagentes. Codex CLI tiene el mismo contenido vía su plugin `expo`
(`codex plugin add expo@openai-curated`, ya instalado) — el handoff debe
pedirle cargarlas.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## AWS Guidance

- Prefer the AWS MCP Server for AWS interactions — it provides sandboxed
  execution, observability, and audit logging. If unavailable, use the
  AWS CLI directly.
- Before starting a task, check whether a relevant AWS skill is available.
  Load the skill with `retrieve_skill` and prefer its guidance over
  general knowledge.
- When uncertain about specific AWS details (API parameters, permissions,
  limits, error codes), verify against documentation rather than guessing.
  State uncertainty explicitly if you cannot confirm.
- When creating infrastructure, prefer infrastructure-as-code (AWS CDK or
  CloudFormation) over direct CLI commands.
- When working with infrastructure, follow AWS Well-Architected Framework
  principles.
- Do not use em dashes in AWS resource names or descriptions. Use
  hyphens instead.

### Secret Safety

- MUST load the `aws-secrets-manager` skill first for any secret,
  credential, API key, token, or password task. MUST NOT call
  `secretsmanager get-secret-value` or `batch-get-secret-value`, and MUST
  NOT hit the Secrets Manager Agent daemon directly. MUST use
  `{{resolve:secretsmanager:secret-id:SecretString:json-key}}` with
  `asm-exec` so the secret resolves at runtime without entering context.
