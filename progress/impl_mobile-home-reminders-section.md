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
- **R5**: rojos `9bbbbd8` (M1 de producción: verde en UTC y rojo en México)
  y `5e591b0` (parseo UTC de fecha visible: `14 sep`); verdes `a6b82bf` y
  `af8ae4e` (aritmética y formato por componentes locales de calendario).
- **R1**: rojo `16c6b22` (estructura, rótulo y enlace); verde `f498f1e`
  (cabecera y cuerpo vacío conforme a D1, más las siete claves necesarias).
  La auditoría endureció clase/orden con el rojo conjunto `6247c3f` y el verde
  `0e00251`, ambos nombrando R1.
- **R6**: rojo `6247c3f` (fixture distinta en lista y detalle, enlace exacto de
  nombre/fecha/contador e inercia); verde `0e00251` (fila `Card` desde el
  detalle, sin renderizar el id ni añadir navegación).
- **R7**: rojo `bbb54e4` (`0 d` contradice `Hoy`); verde `675390c` (helper de
  módulo con ramas futura, hoy y vencida, y texto/nombre accesible unidos).
- **R8**: rojo `e0c15c7` (estado vacío ausente); verde `0752baf` (`Card`
  neutral con la misma anatomía de fila y sin datos ficticios).
- **R9**: rojo `1f2ed2b` (esqueleto ausente y cardinalidad pendiente 0 en vez
  de 1); verde `36012d4` (un esqueleto y silencio en todos los errores). La
  cardinalidad trasladada por D1 cuenta `children`, no `testID`.
- **R10**: rojo `6087349` (cero navegación y cero apariciones de la ruta);
  verde `0844b75` (un único `router.push('/reminders')`, fuera de
  `QUICK_ACTIONS`, sin cast ni ruta nueva).
- **R11**: rojo `c4c0b45` (mutación de producción que quitó el nombre accesible
  y murió con `undefined`); verde `e34b07e` (restauración del label expandido,
  con un solo botón accesible en la sección).
- **R12**: rojo `8f694bb` (M8 de producción quitó `TABULAR_NUMS` y recibió
  `undefined`); verde `677ab51` (contador tabular; nombre, fecha y vacío sin
  cifras tabulares; `Card` y huecos de categoría verificados).
- **R13**: rojo `edef02e` (mutación de producción `Syringe` → `CalendarPlus`);
  verde `285efa7` (dos usos reales de `Syringe`, tamaño 20, sin emoji, y doble
  nominal añadido solo como preparación).
- **R14**: rojo `c1be954` (orden observado con la sección antes de accesos);
  verde `2666977` (sección entre actividad semanal y última posición, sin
  alterar los tres candados de orden heredados).
- **R15**: rojo `837e838` (mutación de producción elevó `getPet` de 1 a 2);
  verde `1ad0d08` (recuento preservado: lista 1, detalle 1, actividad 1).

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
