# Obsidian — usar este proyecto como vault

> Abre la **raíz del proyecto** como vault de Obsidian (`Abrir carpeta como
> vault` → selecciona esta carpeta). No hace falta ninguna configuración
> adicional: `specs/`, `progress/` y `docs/` ya usan frontmatter YAML y
> wikilinks compatibles con Obsidian tal cual.

---

## Qué obtienes

- **Frontmatter YAML** en cada spec (`specs/<feature>/*.md`) y en las
  entradas de `progress/history.md`: `feature`, `status`, `tags`. Obsidian los
  indexa automáticamente para búsquedas y el panel de propiedades.
- **Wikilinks** (`[[requirements]]`, `[[../../docs/architecture|architecture]]`)
  entre `requirements.md` ↔ `design.md` ↔ `tasks.md` ↔ `traceability.md` de
  cada feature, y de vuelta hacia `docs/architecture.md`.
- **Grafo**: el grafo de Obsidian muestra visualmente feature ↔ spec ↔
  sesiones de progreso — útil para ver de un vistazo qué features están
  conectadas a qué decisiones de arquitectura.

---

## Qué NO se incluye

- **No se crea `.obsidian/`** en esta plantilla. Obsidian la genera sola la
  primera vez que abres la carpeta como vault (contiene configuración local
  de la app, no contenido del proyecto).
- **No se requiere ningún plugin.** Todo lo anterior funciona con Obsidian
  vanilla.

`.obsidian/` ya está en el `.gitignore` que trae la plantilla — no hace falta
añadirlo a mano. Si tu proyecto ya tenía un `.gitignore` propio antes de
aplicar la plantilla, confirma que la línea sigue ahí tras el merge.

---

## Convención de wikilinks en este harness

- Dentro de una spec, enlaza a sus hermanos por nombre simple: `[[design]]`,
  `[[requirements]]`, `[[tasks]]`, `[[traceability]]`.
- Para enlazar a `docs/` desde `specs/<feature>/`, usa ruta relativa con alias:
  `[[../../docs/architecture|architecture]]`.
- Para enlazar a una spec desde `progress/`, usa la ruta completa:
  `[[specs/<feature>/requirements|spec]]`.
