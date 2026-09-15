# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- feature: meals-served-tracking (#83, P3, backend + movil)
- inicio: 2026-09-15
- worktree: /home/claude/sites/Pet-Tracker-wt-backend, rama feature/83-meals-served-tracking desde main 1b9efe86 (post #96)
- base de datos: pet_tracker_wt (Postgres 5433); LocalStack 4566 compartido con la sesion Frontend (#97 en el tree principal): avisar por SendMessage antes de init.sh o e2e
- baseline init.sh: exit 0 (backend 166 suites / 1279 tests, harness 14, movil verde, e2e 26 de 29 con 3 aws-real skipped); primer init.sh con la guarda de infra de #96 desde este worktree
- fase: explorer (progress/explore_meals-served-tracking.md) y despues spec_author; feature sigue `pending` hasta spec_ready
- coordinacion movil con #97: el que anada claves i18n avisa (candado de longitud en language-provider.test.tsx); #83 no toca src/app/(tabs)/_layout.tsx salvo que la spec lo decida, y entonces se avisa
- flakes conocidos en la suite movil: alerts/index.test.tsx y add-pet/index.test.tsx (#72, P2); verde aislado, rojo en primera corrida completa
