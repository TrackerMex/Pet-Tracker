# Setup AWS Agent Toolkit

```
tarea: setup AWS Agent Toolkit (harness, no feature)
inicio: 2026-08-09 America/Mexico_City
agentes lanzados: —
estado: completado; PR #31 mergeado a main (d43f179)
```

Pasos 1-7 de `setup-instructions/setup.md` del repo `aws/agent-toolkit-for-aws`, región `us-east-1`.

| Pieza | Estado |
|---|---|
| AWS CLI | v2.36.19 en `~/AppData/Local/Programs/Amazon/AWSCLIV2/aws.exe` (fuera del PATH) |
| uv / uvx | 0.12.3 en `~/.local/bin`; requerido por `aws-mcp` |
| Identidad | usuario IAM `pet-tracker-dev` (cuenta `100678005099`) con ReadOnlyAccess + SignInLocalDevelopmentAccess y MFA |
| Root | MFA activado, fuera de la cadena de credenciales |
| Skills | 18 skills AWS en `~/.claude/skills` |
| MCP | `aws-mcp` en `~/.claude.json` (global, sin secretos); verificado con `sts get-caller-identity` y `s3api list-buckets` |
| Reglas | sección `## AWS Guidance` en `CLAUDE.md`, PR #31 |

Notas operativas:

- Los comandos `aws` los ejecuta el humano con `!`; el shell no tiene TTY, así que los prompts interactivos necesitan pipe (`printf 'y\n' | aws.exe login ...`).
- `aws-mcp` hereda el profile `default`. Cambiar de profile cambia con qué permisos opera el agente.
- Sigue vigente el trabajo local con LocalStack; esta cuenta AWS está vacía (0 buckets).
