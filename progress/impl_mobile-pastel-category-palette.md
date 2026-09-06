# Implementación #64 — mobile-pastel-category-palette

Fecha: 2026-09-06  
Rama: `feature/64-mobile-pastel-category-palette`  
HEAD de implementación: `ba9750f`  
Estado: **R1–R10 implementados; queda abierto únicamente el smoke humano en Android**

## Resultado

La paleta pastel categórica quedó implementada con los diez valores claros y
los diez oscuros aprobados, sus candados de contraste y CIEDE2000, el reparto de
recordatorios y documentos, los tres usos categóricos actualizados y la tabla
normativa de la carta. No cambió conducta, navegación, copy visible ni ningún
`testID`.

Se leyó completa la spec aprobada y se cargaron, en este orden,
`expo-overview` y `expo-design-system`. De `appllama-app-design-skill` se tomó
solo el patrón; `docs/ui-guidelines.md`, en especial §Dirección de arte, gobernó
la implementación.

La discrepancia detectada originalmente en R4 quedó resuelta por la enmienda
humana firmada del 2026-09-05. El test rojo se alineó con esa enmienda antes de
añadir la implementación; no se cambió ni recalculó ningún valor aprobado.

## Historial TDD y cierre por R-id

| R-id | Commit | Papel / resultado |
|---|---|---|
| R1 | `a89c8ee` — `test(mobile-pastel-palette): R1 fija la paleta clara (rojo)` | Rojo aislado. |
| R1 | `435a4e0` — `feat(mobile-pastel-palette): R1 declara la paleta clara` | Cierra R1: diez tokens claros exactos. |
| R1 | `03fb64a` — `docs(mobile-pastel-palette): R1 registra el ciclo rojo-verde` | Registra el par en trazabilidad. |
| R2 | `edfdf38` — `test(mobile-pastel-palette): R2 fija la paleta oscura (rojo)` | Rojo aislado. |
| R2 | `bfc7779` — `feat(mobile-pastel-palette): R2 declara la paleta oscura` | Cierra R2: diez tokens oscuros exactos y luminancia fijada. |
| R2 | `0e02b10` — `docs(mobile-pastel-palette): R2 registra el ciclo rojo-verde` | Registra el par en trazabilidad. |
| R3 | `3521773` — `test(mobile-pastel-palette): R3 exige contraste AA (rojo)` | Rojo aislado. |
| R3 | `20bd366` — `feat(mobile-pastel-palette): R3 verifica contraste AA` | Cierra R3: doce ratios aprobados, todos AA. |
| R3 | `ca0e5fe` — `docs(mobile-pastel-palette): R3 registra el ciclo rojo-verde` | Registra el par en trazabilidad. |
| R4 | `395d13a` — `test(mobile-pastel-palette): R4 exige separación perceptual (rojo)` | Rojo original aislado. |
| R4 | `9e9e017` — `docs(spec): #64 corrige dos celdas de la tabla CIEDE2000, pendiente de firma` | Enmienda de spec; no implementa. |
| R4 | `56b201f` — `Approve corrected palette contrast values in requirements` | Firma humana de la enmienda. |
| R4 | `feac447` — `test(mobile-pastel-palette): R4 alinea el rojo con la enmienda` | Corrige solo el test rojo conforme a la firma. |
| R4 | `2e0315e` — `feat(mobile-pastel-palette): R4 verifica separación perceptual` | Cierra R4 con CIEDE2000 D65 y las excepciones verdes explícitas. |
| R4 | `f04ee15` — `docs(mobile-pastel-palette): R4 registra el ciclo rojo-verde` | Registra rojo, ajuste y verde. |
| R5 | `c5e01ab` — `test(mobile-pastel-palette): R5 fija los huecos de recordatorio (rojo)` | Rojo aislado. |
| R5 | `c7a2223` — `feat(mobile-pastel-palette): R5 asigna huecos a recordatorios` | Cierra R5: siete tipos, labels y emoji preservados. |
| R5 | `6905fe8` — `docs(mobile-pastel-palette): R5 registra el ciclo rojo-verde` | Registra el par en trazabilidad. |
| R6 | `625e522` — `test(mobile-pastel-palette): R6 fija el mapeo documental (rojo)` | Rojo aislado. |
| R6 | `dc9675a` — `feat(mobile-pastel-palette): R6 resuelve categorías documentales` | Cierra R6: variantes conocidas y respaldo neutral. |
| R6 | `cfe91f8` — `docs(mobile-pastel-palette): R6 registra el ciclo rojo-verde` | Registra el par en trazabilidad. |
| R7 | `9f4bd02` — `test(mobile-pastel-palette): R7 fija el color por tipo (rojo)` | Rojo aislado. |
| R7 | `2319d4e` — `feat(mobile-pastel-palette): R7 pinta recordatorios por tipo` | Cierra R7: solo cambia el tile categórico de la fila. |
| R7 | `6662f1e` — `docs(mobile-pastel-palette): R7 registra el ciclo rojo-verde` | Registra el par en trazabilidad. |
| R8 | `d30ecad` — `test(mobile-pastel-palette): R8 fija filas documentales (rojo)` | Rojo aislado y actualización autorizada de #62 R10. |
| R8 | `33ce3af` — `feat(mobile-pastel-palette): R8 pinta documentos por tipo` | Cierra R8: tile y badge categóricos, neutral para desconocidos. |
| R8 | `9e2232e` — `docs(mobile-pastel-palette): R8 registra el ciclo rojo-verde` | Registra el par en trazabilidad. |
| R9 | `f41678b` — `test(mobile-pastel-palette): R9 blinda el inventario categórico (rojo)` | Rojo aislado. |
| R9 | `3e42193` — `feat(mobile-pastel-palette): R9 verifica el inventario categórico` | Cierra R9: literales, interpolación y 17 acentos. |
| R9 | `f4d7073` — `docs(mobile-pastel-palette): R9 registra el ciclo rojo-verde` | Registra el par en trazabilidad. |
| R10 | `2af79d5` — `test(mobile-pastel-palette): R10 fija la tabla de huecos (rojo)` | Rojo aislado. |
| R10 | `349e349` — `feat(mobile-pastel-palette): R10 documenta la tabla de huecos` | Cierra R10 con el bloque literal aprobado. |
| R10 | `099ccf9` — `docs(mobile-pastel-palette): R10 registra el ciclo rojo-verde` | Registra el par en trazabilidad. |
| R9 | `0c3346d` — `test(mobile-pastel-palette): R9 encapsula su inventario` | Refactor: mueve el helper dentro del `describe('#64 R9')` para respetar la regla de tests preexistentes. |
| R9 | `ba9750f` — `docs(mobile-pastel-palette): R9 registra el encapsulado` | Añade el refactor a trazabilidad. |

Cada commit creado durante la implementación se hizo después de ejecutar
`bun run test` desde `mobile-pet-tracker/`. Los commits rojos fallaron solo por
el R-id recién añadido; cada verde y cada commit documental partieron de una
ejecución verde.

## Grep-clean e invariantes rehechos a mano

- Las clases `bg-category-*` / `text-category-*` aparecen en una sola fuente de
  producción: `src/utils/category-palette.ts`; están las diez escritas enteras.
- No hay interpolación categórica en código ejecutable. La única cadena
  `bg-category-${slot}` es el ejemplo prohibido del comentario literal exigido
  por `design.md` §4.2, y el candado excluye comentarios al buscar ejecución.
- `bg-accent-soft`: 17 ocurrencias de producción; Reminders conserva 1 y Docs
  conserva 0. El inventario sitio a sitio coincide con `design.md` §5.
- Cero hex fuera de `src/theme/`, cero clases Tailwind arbitrarias, cero
  `StyleSheet.create` y cero shadow/elevation legacy en fuentes de producción.
- Cero cambios bajo `backend-pet-tracker/` o `infra/`; la Home y su rejilla de
  accesos rápidos no se tocaron.
- `--accent`, `--radius-card`, `--warning`, `--danger` y `--success` conservan
  sus valores previos; el diff de `global.css` solo añade los veinte tokens
  categóricos aprobados.
- No cambió navegación, lógica de negocio, texto visible ni ningún `testID`.
  Labels y emoji permanecen exactos y siguen acompañando al color.
- Los tests preexistentes solo ganan bloques `describe('#64 R…')`, más la
  aserción exacta de #62 R10 autorizada por R8 y el helper CIEDE2000 exigido por
  R4 junto a `contrast`.
- Ninguna fila R1–R10 de `traceability.md` contiene `pendiente`.

## Verificación final

### `bun run test`

Última ejecución autónoma desde `mobile-pet-tracker/`:

```text
Test Suites: 59 passed, 59 total
Tests:       891 passed, 891 total
Snapshots:   1 passed, 1 total
```

También pasaron `bun run lint` y `bun run typecheck`.

Hubo una ejecución aislada en la que el test preexistente de selección de foto
de `add-pet` consumió su mock y falló. Sin cambiar código, la repetición completa
pasó 891/891, igual que las ejecuciones posteriores y la incluida en `init.sh`.

### `./init.sh` completo

Ejecutado desde la raíz, sin omitir fases y con salida final 0:

- build backend: verde;
- `pnpm -C infra run synth`: verde;
- backend unit: 163 suites / 1235 tests, verde;
- infra: 2 suites / 14 tests, verde;
- harness de entorno: 11 suites / 28 tests, verde;
- mobile: 59 suites / 891 tests, verde;
- backend E2E: 25 suites pasadas y 3 omitidas; 353 tests pasados y 8 omitidos;
- lint backend/infra/mobile: verde;
- typecheck mobile: verde;
- salida: `✅ Todo verde. Listo para trabajar.`

Los avisos de `.env` (`RESEND_API_KEY`, `RESEND_FROM`, `RESET_LINK_HOST`) y de
`STATUS.md` desactualizado ya pertenecen al estado del branch y no bloquean el
gate. `init.sh` no dejó cambios de trabajo bajo backend ni infra.

## Trabajo abierto

Solo queda el gate no delegable: smoke humano en dev build Android, en temas
claro y oscuro, sobre Reminders y Documentos. Hasta que el humano lo cierre, la
feature permanece `in_progress`; no se marca `done` ni se vacía su seguimiento
de sesión.
