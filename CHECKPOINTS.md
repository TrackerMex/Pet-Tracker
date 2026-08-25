# CHECKPOINTS — Evaluación del estado final

> En sistemas multi-agente no se evalúa el camino, se evalúa el destino.
> Estos son los checkpoints objetivos que un reviewer (humano o agente) usa
> para decidir si una feature está realmente terminada.

---

## C1 — El arnés está completo

- [ ] Existen los archivos base: `CLAUDE.md`, `AGENTS.md`, `CHECKPOINTS.md`, `STATUS.md`, `init.sh`, `init.config.sh`, `feature_list.json`
- [ ] Existen los 5 docs: `docs/architecture.md`, `docs/conventions.md`, `docs/verification.md`, `docs/specs.md`, `docs/obsidian.md`
- [ ] Existe `specs/` con al menos la plantilla `_template/`
- [ ] Existen los 5 agentes: `.claude/agents/leader.md`, `spec_author.md`, `explorer.md`, `implementer.md`, `reviewer.md`
- [ ] `./init.sh` termina con exit code 0

---

## C2 — El estado es coherente

- [ ] Máximo una feature en `in_progress` en `feature_list.json`
- [ ] Toda feature `done` tiene al menos un test que la cubre
- [ ] `progress/current.md` está vacío (plantilla) o describe la sesión activa
- [ ] `progress/history.md` tiene entrada de cada sesión cerrada

---

## C3 — El código respeta la arquitectura

- [ ] La arquitectura respetada es la documentada en `docs/architecture.md`
      (capas domain / application / infrastructure, regla de dependencia hacia adentro)
- [ ] Las entidades de domain no importan nada de infrastructure (ORM, HTTP, IO)
- [ ] Los repositorios/contratos en domain son interfaces puras, sin implementación
- [ ] La capa application solo depende de interfaces, nunca de la implementación concreta
- [ ] La capa infrastructure implementa las interfaces de domain, no al revés

---

## C4 — TDD: toda feature done tiene tests que nombran sus R-ids

- [ ] Cada requisito `R<n>` de `specs/<feature>/requirements.md` tiene al menos
      un test que lo nombra explícitamente (ej: `describe('R1: ...')` o
      equivalente en el framework de test del stack)
- [ ] El historial de commits de la feature muestra el patrón test-primero
      (test rojo → implementación → verde → refactor), no todo en un commit

---

## C5 — Trazabilidad: R → test → commit

- [ ] `specs/<feature>/traceability.md` existe y no tiene ninguna fila "pendiente"
- [ ] Cada requisito tiene su test y su commit registrados
- [ ] Los commits de la feature siguen el formato `feat(<scope>): <desc> (R1,R2)`

---

## C6 — Specs: toda feature done tiene spec aprobada

- [ ] `specs/<feature>/requirements.md` existe con `status: approved` en el frontmatter
- [ ] La casilla "Aprobado por humano" está marcada con fecha
- [ ] Ningún requisito fue modificado después de la aprobación sin pasar de nuevo por el gate

---

## C7 — Ninguna feature deja código huérfano de una que reemplaza

- [ ] Si esta feature reemplaza o vuelve obsoleto un componente/módulo de una
      feature anterior (UI, use-case, endpoint), ese código viejo fue
      eliminado en el mismo cierre — no se dejó "por si acaso"
- [ ] Los tests del código eliminado también se eliminaron (no quedan
      `.spec`/`.test` de un archivo que ya no existe)
- [ ] `grep`/búsqueda de importadores del módulo reemplazado no devuelve
      resultados fuera de su propio archivo de test (que también se elimina)

---

## C8 — UI móvil conforme a la carta de UI

> Aplica solo a features que tocan `mobile-pet-tracker/`. Referencia:
> `docs/ui-guidelines.md`.

- [ ] Grep-clean: cero hex fuera de `src/theme/`, cero clases arbitrarias
      `[...]`, cero `StyleSheet.create`, cero shadow/elevation legacy
- [ ] Dimensiones de pantalla según conventions.md §Dimensiones (safe areas
      top y bottom vía `useSafeAreaInsets`)
- [ ] Estados de carga con Skeleton dimensionado, no Spinner suelto
- [ ] Componentes compartidos reutilizados (card, pet-switcher) — no
      recetas duplicadas ni forks locales
- [ ] Elementos tappables con feedback pressed y touch target ≥ 44pt
- [ ] Animaciones nuevas: Reanimated UI thread, interrumpibles, corren en
      Expo Go, sin `Color`/var CSS dentro de estilos animados

---

**Cómo usar este archivo:**
El agente `reviewer` recorre cada checkbox relevante a la feature trabajada,
marca `[x]` o `[ ]`, y rechaza el cierre si queda alguno vacío en C1–C8 (C8 solo si la feature toca la app móvil).
