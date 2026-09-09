# Implementación — mobile-home-reminders-section (#70)

## Alcance

- Branch: `feature/70-mobile-home-reminders-section`.
- Base de deltas: `b0ec5a8`.
- D1-D3 aprobadas por humano en `requirements.md` e incorporadas en `40413db`.
- Cero llamadas nuevas, cero backend, cero infra y cero dependencias.

## Baseline

- `env -u FORCE_COLOR ./init.sh`: exit 0 antes de escribir código.
- Móvil: 68 suites, 1054 tests, 1 snapshot, todo verde.
- Backend: 163 suites, 1243 tests; infra: 2 suites, 14 tests; e2e: 25 suites y 354 tests pasados, 3 suites/8 tests omitidos.

## Implementación por R-id

Se completa durante la secuencia TDD; los hashes definitivos también quedan en
`specs/mobile-home-reminders-section/traceability.md`.

- **R2**: rojo `345558a` (candado del contrato); verde `df759b8` (interfaz
  exacta y `nextReminder`/`activitySummary` intactos). Test dirigido y
  `bun run typecheck`, verdes tras la implementación.
- **R4**: rojo `aa7f9aa` (casos futuro/mañana/hoy/pasado); verde `3badfec`
  (componentes de calendario, medianoches UTC y cero normalizado).

## Premisas corregidas contra el árbol

- D1: la cardinalidad 1/1/0 se prueba en R9, cuando ya existen los hijos reales.
- D2: #83 y #84 ya existen; el cálculo fingido de comidas servidas vive en
  `food.tsx:65-67` y el estado por fila en `food.tsx:194`.
- D3: `calendarDaysUntil` normaliza cero para no producir `-0`; M1 debe mostrar
  asimetría UTC/México y no una diferencia de signo.

## Deltas R18

Pendiente de medir tras la implementación.

## Prueba de mutación R19b

Pendiente: M1-M8, una por una, todas sobre código de producción.

## Verificación final

Pendiente.
