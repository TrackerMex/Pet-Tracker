# Skills — convención de nombres

> Claude Code descubre skills en `.claude/skills/<nombre>/SKILL.md`,
> **un solo nivel de profundidad**. Carpetas anidadas por categoría
> (`.claude/skills/<categoria>/<nombre>/SKILL.md`) NO se auto-detectan —
> es una limitación conocida y todavía abierta del propio Claude Code
> (anthropics/claude-code#28266, #40640), no un bug de esta plantilla.

## Convención: nombre plano con prefijo de track

En vez de anidar en subcarpetas, cada skill vive directo bajo `skills/` y
codifica su categoría ("track") como prefijo del nombre de carpeta:

```
.claude/skills/
  docs-readme-sync/SKILL.md
  security-audit/SKILL.md
  security-threat-model/SKILL.md
  frontend-a11y-check/SKILL.md
  git-ops-commit-msg/SKILL.md
```

Patrón: `<track>-<skill-name>/SKILL.md`.

## Tracks sugeridos

Punto de partida, no obligatorio — edítalo según las skills reales del
proyecto:

| Track | Prefijo | Para qué |
|---|---|---|
| agent-llm | `agent-llm-` | patrones de prompting/uso de Claude propios del proyecto |
| debug | `debug-` | triage y reproducción de bugs |
| security | `security-` | auditoría y modelado de amenazas |
| frontend | `frontend-` | React/UI y accesibilidad |
| testing | `testing-` | convenciones de test del stack elegido |
| refactor | `refactor-` | reescrituras seguras |
| docs | `docs-` | READMEs, changelogs, sincronía de docs |
| data | `data-` | consultas y transformaciones de datos |
| git-ops | `git-ops-` | mensajes de commit, PRs, rebases |

## Cómo añadir una skill nueva

1. Crea `.claude/skills/<track>-<nombre>/SKILL.md`.
2. Frontmatter mínimo:
   ```yaml
   ---
   name: <track>-<nombre>
   description: <una frase — qué hace y cuándo usarla; Claude Code la usa para decidir si aplica>
   ---
   ```
3. Verifica que quedó a un solo nivel: `find .claude/skills -mindepth 2 -name SKILL.md` debe salir vacío.

## Si la skill genera estado o cache local

Algunas skills crean su propia carpeta de estado o cache en la raíz del
proyecto para guardar configuración, logs, o resultados intermedios (por
ejemplo, una skill de diseño de UI que guarda un historial de revisiones).
Esa carpeta es tooling local, no contenido del proyecto:

1. Al instalar una skill así, añade su carpeta a `.gitignore` **en el mismo
   commit** que instala la skill — no lo dejes para después.
2. Si ya se commiteó por accidente: `git rm -r --cached <carpeta>`, añádela
   a `.gitignore`, commitea ambos cambios juntos.
3. Si no estás seguro de si una skill genera este tipo de carpeta, revisa su
   `SKILL.md` o su documentación antes de la primera vez que la uses.
