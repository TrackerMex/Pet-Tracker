# AGENTS.md — Mapa de navegación para agentes de IA

> Proyecto: **pet-tracker** (stack: `NestJS + TypeScript + pnpm + LocalStack (AWS local)`)
>
> Este archivo es el **punto de entrada** para cualquier agente que trabaje en este
> repositorio (Claude Code, Codex CLI, Cursor, Gemini, etc.). NO es una biblia de
> reglas: es un **mapa**. Lee solo lo que necesites cuando lo necesites
> (divulgación progresiva).

---

## 0. Multi-IA

Cualquier agente (Claude Code, Codex, Cursor, Gemini...) empieza por este
archivo. `CLAUDE.md` es solo un wrapper delgado que fija el rol `leader` para
Claude Code y apunta de vuelta aquí. Si usas otra herramienta que requiera su
propio archivo de entrada (`GEMINI.md`, `.cursorrules`, etc.), enlázalo o
cópialo como puntero a `AGENTS.md` — el contenido normativo vive aquí, no se
duplica.

---

## 1. Antes de empezar (obligatorio)

1. Ejecuta `./init.sh` y verifica que termina sin errores. Si falla, **para**
   y resuelve el problema antes de tocar código.
2. Lee `progress/current.md` para saber en qué estado quedó la última sesión.
3. Lee `feature_list.json` y elige **una** tarea. No trabajes en más de una a
   la vez. Respeta el estado de la feature (ver §3 "Estados de una feature").

---

## 2. Mapa del repositorio

| Archivo / carpeta | Qué contiene | Cuándo leerlo |
|---|---|---|
| `feature_list.json` | Lista de features con estado (pending / spec_ready / in_progress / done) — schema de cada entrada en `docs/specs.md` §Schema | Siempre, al empezar |
| `specs/<feature>/` | Spec SDD de una feature: requirements, design, tasks, traceability | Antes de implementar esa feature |
| `progress/current.md` | Estado de la sesión actual | Siempre, al empezar |
| `progress/history.md` | Bitácora append-only de sesiones anteriores | Si necesitas contexto histórico |
| `docs/architecture.md` | Arquitectura (Clean Architecture) del proyecto, qué significa "buen código" | Antes de implementar |
| `docs/data-model.md` | Decisión de engine (Postgres) + modelo de datos starter, ERD y DDL de referencia | Antes de escribir specs o tocar persistencia |
| `docs/conventions.md` | Convenciones de estilo del proyecto (naming, errores, DTOs, tests, commits) | Antes de escribir código |
| `docs/ui-guidelines.md` | Carta de UI móvil: tokens, componentes compartidos, @expo/ui, animación, grep-clean | Antes de cualquier trabajo en `mobile-pet-tracker/` |
| `docs/verification.md` | Cómo verificar que una feature funciona correctamente + disciplina TDD | Antes de declarar done |
| `docs/specs.md` | El proceso SDD completo: estados, gates, cuándo se escribe cada spec | Antes de escribir o aprobar una spec |
| `docs/obsidian.md` | Cómo usar este proyecto como vault de Obsidian | Si usas Obsidian para navegar el proyecto |
| `CHECKPOINTS.md` | Criterios objetivos de "estado final correcto" (C1..C6) | Para auto-evaluarte |
| `.claude/agents/` | Definiciones de subagentes (leader, spec_author, explorer, implementer, reviewer) | Si orquestas trabajo |
| `.claude/skills/` | Skills reutilizables, un nivel plano (`<track>-<nombre>/SKILL.md`) — ver `.claude/skills/README.md` | Antes de repetir una tarea ya resuelta en otro proyecto |
| `env-drift.mjs` | Diff de claves entre `.env` y `.env.example` que usa `init.sh` §2 (#23) | Si `init.sh` avisa de claves faltantes |
| `init.config.sh` | Comandos de build/test/lint específicos de este proyecto | Antes de correr `init.sh` por primera vez |
| `mobile-pet-tracker/` | App móvil Expo SDK 57 (Expo Router + TypeScript + bun) | Para implementar o verificar el cliente móvil |
| `docker-compose.yml` | Infra local: Postgres + LocalStack (`docker compose up -d`) | Antes de trabajar features con persistencia o AWS |
| `.github/workflows/ci.yml` | CI: ejecuta `init.sh` en cada PR y push a main | Si CI falla en un PR |
| ver `docs/architecture.md` | Dónde vive el código de la aplicación y cómo se organiza | Para implementar |

---

## 3. Estados de una feature (ciclo SDD)

```
pending → spec_ready → in_progress → done
```

| Estado | Significa | Quién lo produce |
|---|---|---|
| `pending` | Existe en `feature_list.json`, sin spec todavía | — |
| `spec_ready` | `specs/<feature>/requirements.md` escrito, **aprobado por humano** | `spec_author` + gate humano |
| `in_progress` | Implementación en curso, TDD por requisito | **Codex CLI** (por defecto) o `implementer` (fallback) |
| `done` | Implementado, revisado, tests nombran sus R-ids, traceability sin filas pendientes | `reviewer` |

**Gate de aprobación humana**: entre `spec_ready` e `in_progress` hay un punto
de parada obligatorio. El agente `spec_author` escribe la spec y se detiene;
un humano debe marcar la casilla "Aprobado por humano" en
`specs/<feature>/requirements.md` antes de que cualquier agente empiece a
implementar. Ningún agente se auto-aprueba la spec.

---

## 4. Reglas duras (no negociables)

- **Una sola feature a la vez.** No mezcles cambios de varias tareas en la misma sesión.
- **Todo va por PR.** `main` está protegida: el push directo se rechaza, también
  para harness/docs/specs. Código de features en branch `feature/<id>-<nombre>`,
  bookkeeping y docs en `docs/<tema>` o `update-status-<id>`. Un humano mergea;
  CI debe estar verde (ver `docs/conventions.md`).
- **No se implementa sin spec aprobada.** Si la feature está `pending`, primero
  se escribe y aprueba la spec (ver §3).
- **No declares una tarea `done` sin build verde y tests sin regresión.**
  Ejecuta `./init.sh` y confirma que todo pasa.
- **Documenta lo que haces** en `progress/current.md` mientras trabajas, no al final.
- **Deja el repositorio limpio** antes de cerrar la sesión (ver §6).
- **Si no sabes cómo se hace algo en este proyecto, busca en `docs/`** antes de inventarlo.
  Si no está en docs/, sigue el patrón del módulo más similar en el código existente.
- **Toda variable de entorno nueva se documenta en el mismo cierre que la
  introduce.** Añádela a `docs/conventions.md` (tabla "Variables de
  entorno") y a `.env.example` si el proyecto usa uno — no la dejes para
  "después"; después es cuando se te olvida.

---

## 5. Arquitectura del proyecto

Ver `docs/architecture.md` para la Clean Architecture de este proyecto (capas
domain / application / infrastructure, regla de dependencia, estructura de
módulo en `NestJS + TypeScript + pnpm + LocalStack (AWS local)`).

---

## 6. Cómo elegir una tarea

```
1. Abre feature_list.json
2. Filtra por status != "done"
3. Si hay una "in_progress": continúa esa (nunca abras una segunda)
4. Si no hay ninguna "in_progress":
   - Si hay una "spec_ready": esa es tu próxima feature a implementar
   - Si solo hay "pending": lanza spec_author primero, luego PARA hasta
     aprobación humana de la spec
5. Cambia su status a "in_progress" solo tras el gate humano y anota en
   progress/current.md: feature, hora de inicio, plan breve
```

---

## 7. Cierre de sesión (lifecycle)

Antes de terminar:

1. Ejecuta `./init.sh` — todo debe terminar verde.
2. Si la tarea está acabada: marca `status: "done"` en `feature_list.json` y
   confirma que `specs/<feature>/traceability.md` no tiene filas "pendiente".
3. Actualiza `STATUS.md`: la línea "Features completadas: X/Y" contra el
   conteo real de `feature_list.json`, la sección "Estado actual", y añade
   una entrada en "Última sesión" con fecha, qué se hizo y qué sigue. Esto
   no es opcional ni se pospone — `init.sh` lo verifica en el siguiente paso.
4. Mueve el resumen de `progress/current.md` al final de `progress/history.md`.
5. Vacía `progress/current.md` dejando solo la plantilla base.
6. No dejes archivos temporales, ni `console.log` de debug, ni TODOs sin contexto.
7. Si la sesión trabajó una feature: push de la branch `feature/<id>-<nombre>`
   y abre PR con `gh pr create` (flujo completo en `docs/conventions.md`
   §Branches y Pull Requests). **Ningún agente mergea** — el humano revisa y
   mergea en GitHub. Código de features nunca directo a `main`.

---

## 8. Si te bloqueas

- Relee la sección relevante de `docs/`.
- Mira el módulo o feature más similar ya completada como referencia.
- Si la herramienta no hace lo que esperas: documenta el bloqueo en
  `progress/current.md` y para la sesión.
- **Nunca inventes** un workaround si no entiendes por qué algo falla.
