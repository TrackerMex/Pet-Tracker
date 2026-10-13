# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

## #174 mobile-alerts-canvas-fidelity (sesión Backend, 2026-10-13)

- Worktree: `../Pet-Tracker-wt-174`, branch `feature/174-mobile-alerts-canvas-fidelity` desde origin/main `788d1f89` (#170 mergeada, PR #213). `.env` copiado del árbol principal; `graphify update .` hecho.
- El humano arrancó la feature el 2026-10-13 con «si, dale aclara en las otras sesiones que el diseño final debe de quedar como el artifac». Queda en la descripción de #174 en `feature_list.json` como autorización para cambiar clases, componentes y candados donde el artboard lo pida. Avisado a Frontend (#172), UI-Pet (#173), sites-4c (#171) y sites-99.
- Artboards de referencia: `project/Alertas.dc.html` y `project/DetalleAlerta.dc.html` del canvas https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j, versión `1791913045-37f1` (sha256 `e1e546de…` y `994a775c…`, idénticos a los que usó #170).
- Explore hecho (a715816f): `progress/explore_mobile-alerts-canvas-fidelity.md`, 40 brechas, 19 preguntas abiertas (§8) y propuesta de partir en dos (§9).
- `./init.sh` en wt-174 sobre 788d1f89: EXIT=0. Backend 1474, infra 14, móvil 3101 (103 suites), e2e 468 + 8 omitidos. Aviso de fin enviado a sites-4c, sites-99, UI-Pet y Frontend.
- Decisiones del humano (2026-10-13, respuestas a P-Q1..P-Q19): píxel exacto; dos features (#174 Alertas, #180 Detalle; #176 y #177 los reservó sites-4c); copy aprobado `alerts.daysAgo` «Hace {{days}} días» + `alerts.dayAgo` «Hace 1 día» y `alerts.mapLabel`; cabecera nativa ajustada. Registradas en `feature_list.json`.
- Spec de #174 escrita (R1–R13; `specs/mobile-alerts-canvas-fidelity/`, frontmatter `draft`). El leader corrigió dos anclas que no se podían ejecutar: S4 sin `--` (ugrep salía con 2) y S7 con comillas invertidas escapadas dentro de comillas simples (nunca casaba). Ahora dan 0 en la base y 1 contra el texto final.
- Espejo en Notion (Specs, `Estado del gate` = En revisión), generado desde 4e42253e: https://app.notion.com/p/3f86115a9b278171aff6edcaa48b4aaa. Verificado con fetch: sin `<br>`, casillas al final con `____` intactos y 9 tablas.
- Preguntas abiertas en la spec §5, que aplica la recomendación de cada una: Q1, esperar al merge de #173 (P1–P7); Q2, `--tracking-caps` 0.06em propio, sin unificar con el `--tracking-eyebrow` 0.08em de #175.
- Siguiente: firma del humano en Notion, luego el commit de firma; el handoff a Codex espera además al merge de #173. #180 espera a la firma de #173 y al merge de #174.
