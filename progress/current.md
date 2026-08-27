# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Sesión 2026-08-27 (leader = sesión Backend)

### Feature #45 `pet-lost-mode` — spec_ready

- Spec EARS R1–R9 escrita por spec_author (3903b53) en esta branch.
- Decisiones de producto cerradas en design.md, sujetas al gate humano:
  lost_mode = flag sin efectos automáticos en alerts/positions (efectos =
  feature futura); POST /v1/pets/:petId/lost-mode {enabled} owner-only
  (@RequirePetRole('owner'), 403 al resto); botón móvil deshabilitado
  (no oculto) para no-owner; fix del union myRole en api/types.ts.
- Pendiente: gate humano (casilla §Aprobación + commit en esta branch).
  R9 (smoke Expo Go) tiene casilla aparte para el cierre.
- Tras el gate: handoff backend a Codex CLI; parte móvil por decidir
  (mismo handoff o sesión Frontend).
