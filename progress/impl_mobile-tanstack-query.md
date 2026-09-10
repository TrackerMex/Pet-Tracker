# Implementacion — mobile-tanstack-query (#87)

- Branch: `feature/87-mobile-tanstack-query`
- Base: `main` @ `7f298f2` (la spec declara deltas de candados contra `5666b85`)
- Inicio: 2026-09-10
- Spec: aprobada por humano el 2026-09-10
- Skills: overview del plugin Expo + `native-data-fetching`; la skill literal
  `expo-overview` no existe en la version instalada y su `README.md` es el indice
  oficial del plugin. `tasks.md` descarta las skills de UI porque no se dibuja UI.
- Documentacion Expo leida: referencia versionada SDK 57.0.0.

## Linea base

- `env -u FORCE_COLOR bash ./init.sh`: verde.
- Suite movil: 68 suites, 1111 tests, 1 snapshot; todo verde.
- Typecheck movil: verde.
- Avisos preexistentes: `.env` sin `RESEND_API_KEY`, `RESEND_FROM` y
  `RESET_LINK_HOST`; no bloquean `init.sh` y #87 no usa esas variables.

## Trazabilidad de commits

| Requisito | Commit rojo | Commit verde | Evidencia |
|---|---|---|---|
| R1 | pendiente | pendiente | pendiente |
| R2 | pendiente | pendiente | pendiente |
| R3 | pendiente | pendiente | pendiente |
| R4 | pendiente | pendiente | pendiente |
| R5 | pendiente | pendiente | pendiente |
| R6 | pendiente | pendiente | pendiente |
| R7 | pendiente | pendiente | pendiente |
| R8 | pendiente | pendiente | pendiente |
| R9 | pendiente | pendiente | pendiente |
| R10 | pendiente | pendiente | pendiente |
| R11 | pendiente | pendiente | pendiente |
| R12 | pendiente | pendiente | pendiente |
| R13 | pendiente | pendiente | pendiente |
| R14 | pendiente | pendiente | pendiente |
| R15 | pendiente | pendiente | pendiente |
| R16 | pendiente | pendiente | pendiente |
| R17 | pendiente | pendiente | pendiente |
| R18 | pendiente | pendiente | pendiente |
| R19 | pendiente | pendiente | pendiente |
| R20 | pendiente | pendiente | pendiente |

## Evidencia R20

Pendiente.

## Cierre

Pendiente: suite movil, typecheck, lint, `init.sh`, deltas contra la linea base y
push final.
