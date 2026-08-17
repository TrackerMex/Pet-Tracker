---
name: docs-readme-sync
description: Keep README.md's "componentes" table and AGENTS.md's map table in sync when files move or new top-level pieces are added to the harness. Use when a file referenced by either table is renamed, moved, or removed.
---

# docs-readme-sync

Cuando un archivo o carpeta referenciado en la tabla "Los 8 componentes" de
`README.md` o en la tabla "Mapa del repositorio" de `AGENTS.md` cambia de
ruta, se renombra o se elimina:

1. Busca todas las referencias a la ruta vieja: `grep -rn "<ruta-vieja>" README.md AGENTS.md`
2. Actualiza cada fila afectada con la ruta nueva.
3. Si el cambio agrega un componente nuevo (no solo mueve uno existente),
   añade una fila nueva en vez de sobrescribir una existente.
4. No toques el resto de la tabla ni reordenes filas no afectadas.
