# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Plantilla (sesión sin iniciar)

```
feature: —
inicio: —
agentes lanzados: —
estado: sin sesión activa
```

---

```
feature: #19 aws-real-credentials
inicio: 2026-08-09 18:35 America/Mexico_City
rama: feature/19-aws-real-credentials
agentes lanzados: spec_author_19
estado: spec aprobada por humano 2026-08-09; implementación en manos de Codex CLI
```

## Reparto multi-IA (nuevo en esta sesión)

- Claude Code (`leader`): spec, review, bookkeeping, PR.
- Codex CLI (terminal aparte, lee `AGENTS.md`): implementación TDD.
- Humano: aprueba spec, mergea PR, corre cualquier comando con costo AWS.
- Handoff por disco: Codex lee `specs/aws-real-credentials/`, escribe
  `progress/impl_aws-real-credentials.md`. Nada de contenido por chat entre
  las dos IAs.
- Un solo escritor sobre `backend-pet-tracker/src/` a la vez: mientras Codex
  implementa, Claude solo toca `docs/`, `specs/`, `progress/`, `feature_list.json`.

## Notas de arranque

- `./init.sh` verde: 117 suites / 843 unit, lint y typecheck limpios.
  e2e saltados (Postgres 5432 abajo).
- PR #32 (feature #14) ya mergeado — el bloqueo de token que registraba la
  sesión anterior está resuelto.
