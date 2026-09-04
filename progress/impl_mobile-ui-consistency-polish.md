# impl: mobile-ui-consistency-polish

Fecha: 2026-09-04

Feature: **#62**, branch `feature/62-mobile-ui-consistency-polish`

Implementador: Codex CLI, en el worktree exclusivo
`/home/claude/sites/Pet-Tracker-wt-ui`.

## Resultado

R1–R16 están implementados y trazados. La suite móvil termina con **58 suites,
855 tests y 1 snapshot verdes**; `tsc --noEmit` y `expo lint` también terminan
con exit 0. La feature permanece `in_progress` porque AC8 exige un smoke humano
en un dev build Android, lado a lado con Figma y en ambos temas.

Antes de tocar código se cargaron, en el orden exigido, las guías
`expo-overview`, `expo-design-system`, `expo-native-ui` y
`appllama-app-design-skill`. De Appllama se tomó el patrón de composición; el
sistema de estilos siguió exclusivamente `docs/ui-guidelines.md`: cero
`Color.ios.*`, cero `StyleSheet.create`, cero hex fuera del tema y cero clases
arbitrarias.

## Historial rojo → verde por R-id

Cada commit rojo contiene solo pruebas. Cada implementación quedó en un commit
posterior y separado. Los commits de trazabilidad también están separados.

| R-id | Qué cierra | Rojo | Verde / gate | Trazabilidad | Ajustes aislados |
|---|---|---|---|---|---|
| R1 | Escala de radios escrita y 12 botones primarios con una receta | `b6ffba4` | `8732d69` | `beb5e5f` | — |
| R2 | Skeletons con el radio del contenido sustituido | `ebca8e0` | `6961833` | `db0d046` | — |
| R3 | Cuatro superficies migradas al `Card` compartido | `2357828` | `4078c42` | `a174e1b` | — |
| R4 | Cero radios fuera de la escala declarada | `d67215f` | `cb14e6d` | `bcd88bf` | — |
| R5 | Tratamiento único para los seis títulos de card auditados | `760f9da` | `c020867` | `c1008ba` | `dd687cc`, fixture completa de actividad |
| R6 | Última fila de `pet-info-card` sin separador colgante | `3a63cb5` | `338de85` | `03a66b3` | — |
| R7 | Glifos de navegación sustituidos por iconos | `7c65979` | `fd08d24` | `bb08f0e` | — |
| R8 | Carga de Home con Skeleton dimensionado | `9c78cea` | `c481561` | `5c97fdf` | `4d7bcbf`, matcher compatible con la clase base de HeroUI |
| R9 | `WeightChart` dentro de `Card` | `e8a1bfd` | `4ae75d6` | `9a38455` | `5752023`, fixture con dos mediciones para renderizar el SVG |
| R10 | Tipo documental presentado como badge | `2d04b61` | `7bac892` | `4512dc7` | — |
| R11 | Chips de especie con la receta común | `5243e2a` | `42c8c80` | `13244b2` | — |
| R12 | Placeholders temáticos y campos crudos sin borde duplicado | `200fbe8` | `cc1d927` | `189caef` | — |
| R13 | Cero usos de `useThemeColor` de HeroUI | `22d2851` | `35a1978` | `35343ae` | — |
| R14 | 33 esquinas no-cápsula continuas | `20cc490` | `617d700` | `809f291` | — |
| R15 | 14 valores con cifras tabulares; GPS excluido | `fe78420` | `30d3285` | `35f8f18` | `07780bc`, contrato compatible con `TextStyle` |
| R16 | Gate mecánico completo | —, la spec excluye un test Jest | `43f3f92` | `ac4537f` | Evidencia en `progress/gate_r16_mobile-ui-consistency-polish.md` |

Desde el primer rojo hasta el cierre de R16 hay **51 commits**: 15 rojos, 15
implementaciones mínimas, 15 cierres de trazabilidad, 4 ajustes aislados y 2
commits del gate R16. Se supera el mínimo de 32 y no hay ningún commit que
mezcle un test rojo con su implementación.

## Cambios de producción por requisito

- **R1–R4:** se documentó y aplicó la escala `rounded-card` / `rounded-xl` /
  `rounded-full`; se alinearon tres skeletons y las cuatro superficies
  autorizadas ahora componen `Card`.
- **R5–R7:** se uniformaron títulos de card, se hizo explícita la última fila de
  `InfoRow` y se sustituyeron exclusivamente los siete glifos tipográficos de
  navegación.
- **R8–R11:** Home reserva espacio con `Skeleton`, la gráfica de peso vive en
  una card, el tipo de documento es badge y los chips de especie comparten
  receta.
- **R12–R13:** los cinco placeholders crudos salen de `muted`, los seis
  `TextInput` crudos pierden el borde duplicado y Forgot usa el hook temático
  del repo con `accent-strong`.
- **R14–R15:** `native-styles.ts` centraliza `CONTINUOUS_CORNER` y
  `TABULAR_NUMS`; hay exactamente 33 esquinas continuas y 14 contadores
  tabulares.
- **R16:** se rehízo el alcance completo y todos los conteos de `design.md` §5.

Archivos nuevos solicitados:

- `mobile-pet-tracker/src/theme/native-styles.ts`
- `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`

`mobile-pet-tracker/src/theme/global.css`, `backend-pet-tracker/` e `infra/`
permanecen sin cambios.

## Invariante duro

No cambió ningún `useState`, `useEffect`, contrato, llamada a `api/`, handler,
ruta ni texto visible. El `router.push('/pairing')` que aparece en ambos lados
del diff conserva exactamente su expresión y solo cambia de indentación por la
composición visual con `Card`.

No se renombró ni eliminó ningún `testID`; los dos únicos nuevos son
`warning-card-${warning.code}` y `weight-chart-card`, ambos autorizados en
`design.md` §6. Los tests preexistentes tienen **0 líneas eliminadas**. Los ocho
emoji permanecen intactos, incluidos `src/utils/reminder-meta.ts` y el `📄` de
Docs. Tampoco se tocó el reset de estado reservado para #63.

## Verificación final

Suite configurada del proyecto, desde `mobile-pet-tracker/`:

```text
$ bun run test -- --silent
Test Suites: 58 passed, 58 total
Tests:       855 passed, 855 total
Snapshots:   1 passed, 1 total
```

También verdes:

```text
$ bun run typecheck
$ tsc --noEmit

$ bun run lint
$ expo lint
```

La orden literal `bun test` activa el runner nativo de Bun y no el script Jest
de `package.json`; con `jest-expo` falla durante la carga del harness incluso
en la base. Por eso todas las ejecuciones pre-commit y el gate final usaron
`bun run test -- --silent`, que sí ejecuta la suite móvil configurada. No se
alteró tooling para disimular esa incompatibilidad porque quedaba fuera de
alcance.

No se repitió `./init.sh` al cierre porque su `BUILD_CMD` incluye
`pnpm -C infra run synth`; ejecutar CDK estaba expresamente prohibido por el
humano. El `./init.sh` inicial sí fue verde antes de la primera modificación.
Se ejecutaron directamente todos los gates aplicables a la superficie móvil:
Jest, typecheck, lint, diff de alcance y conteos anti-slop.

## Conteos de R16

El detalle reproducible está en
`progress/gate_r16_mobile-ui-consistency-polish.md`. Resumen:

| Comprobación | Resultado |
|---|---:|
| Radios prohibidos (`2xl`, `lg`, `md`, `sm`) | **0** |
| Glifos `←` / `›` | **0** |
| Emoji preservados | **8** |
| Esquinas continuas | **33** |
| Contadores tabulares | **14** |
| Botones sólidos con receta única | **12** |
| `useThemeColor` de HeroUI | **0** |
| `useThemeColors(['accent'])` | **0** |
| Placeholders sin color temático | **0 de 5** |
| `TextInput` con borde duplicado | **0 de 6** |
| Hex fuera del tema / clases arbitrarias / `StyleSheet.create` / sombras legacy | **0 / 0 / 0 / 0** |
| Archivos de backend, infra o `global.css` tocados | **0** |

## Decisión de tipado en R15

React Native 0.86 declara `TextStyle.fontVariant` como array mutable. La línea
literal propuesta por la spec convierte el array en `readonly` mediante el
`as const` exterior y `tsc` rechaza los 14 usos. Se conservó la API y el valor,
tipando únicamente la tupla interna:

```ts
export const TABULAR_NUMS = {
  fontVariant: ['tabular-nums'] as ['tabular-nums'],
} as const;
```

El cambio mínimo está fijado por test, aislado en `07780bc` y validado por
typecheck.

## Pendiente para el humano

No queda trabajo de código abierto. Quedan dos gates de proceso:

1. Revisión independiente de la rama, reejecutando R16.
2. AC8: smoke en dev build de Android, en tema claro y oscuro, siguiendo los
   13 puntos de `specs/mobile-ui-consistency-polish/tasks.md` §Cierre.

Hasta que AC8 quede firmado, no se debe cambiar `feature_list.json` a `done`,
ni ejecutar el cierre de `STATUS.md` / `progress/history.md`.
