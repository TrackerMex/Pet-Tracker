# Gate mecánico: mobile-ui-consistency-polish

Fecha: 2026-09-04

Feature: **#62**, branch `feature/62-mobile-ui-consistency-polish`

Base de la feature (`merge-base` con `origin/main`): `b222d33d25b0`

HEAD comprobado antes de escribir este reporte: `35f8f18d7ed5`

Este archivo registra la ejecución de R16 por el implementador. No sustituye
la revisión independiente posterior ni el smoke humano de AC8.

## Veredicto de R16

**PASA.** Suite Jest, typecheck, lint, alcance, historial y conteos anti-slop
cumplen la spec aprobada. AC8 sigue pendiente porque solo lo puede cerrar un
humano en un dev build de Android, en tema claro y oscuro.

## Suite móvil

Comando canónico del proyecto: `bun run test -- --silent` desde
`mobile-pet-tracker/` (`package.json` define `test` como `jest`). Resultado:

```text
Test Suites: 58 passed, 58 total
Tests:       855 passed, 855 total
Snapshots:   1 passed, 1 total
Time:        23.108 s
```

Comprobaciones adicionales:

```text
bun run typecheck  -> exit 0 (tsc --noEmit)
bun run lint       -> exit 0 (expo lint)
```

No se ejecutó `./init.sh` en el cierre: su `BUILD_CMD` ejecuta
`pnpm -C infra run synth`, y la instrucción humana de esta sesión prohíbe
expresamente ejecutar CDK. El `./init.sh` inicial sí terminó verde antes de
tocar código. La superficie modificada de aplicación es exclusivamente móvil,
y sus tres gates aplicables se ejecutaron directamente arriba.

## Alcance del diff

`git diff origin/main...HEAD --stat` en el HEAD comprobado:

```text
38 files changed, 2904 insertions(+), 86 deletions(-)
```

El diff incluye la spec y los documentos de arranque de la rama, además de la
implementación. Comprobaciones mecánicas:

| Comprobación | Resultado |
|---|---:|
| Archivos bajo `backend-pet-tracker/` | **0** |
| Archivos bajo `infra/` | **0** |
| Cambios en `mobile-pet-tracker/src/theme/global.css` | **0** |
| Líneas eliminadas en `*.test.ts` / `*.test.tsx` | **0** |
| Tests preexistentes modificados fuera de bloques añadidos `describe('#62 R…')` | **0** |
| `testID` renombrados o eliminados | **0** |
| Variables de entorno nuevas | **0** |

La única línea con `router.*` que aparece en el diff de producción es el mismo
`onPress={() => router.push('/pairing')}` en ambos lados, movido de indentación
al migrar su contenedor visual a `Card`. No cambian `useState`, `useEffect`,
llamadas a `api/`, handlers, rutas, contratos ni texto visible. Los dos únicos
`testID` añadidos son los autorizados por la spec: `warning-card-${warning.code}`
y `weight-chart-card`.

## Historial TDD

Desde el primer rojo (`b6ffba4`) hasta el HEAD comprobado hay **49 commits**:

- 15 commits rojos, uno para cada R1–R15;
- 15 commits mínimos de producción, uno para cada R1–R15;
- 15 cierres de trazabilidad;
- 4 ajustes de test/fixture, siempre separados de producción.

R16 no tiene test Jest por decisión explícita de `tasks.md`; este reporte es su
gate. El historial supera el mínimo de 32 commits y conserva separados todos
los ciclos rojo→verde.

## Conteos anti-slop

Medidos sobre `mobile-pet-tracker/src/**/*.{ts,tsx}`, excluyendo `__tests__/` y
`*.test.ts(x)`, como exige `design.md` §5:

| Métrica | Resultado | Objetivo |
|---|---:|---:|
| Hues de acento | **1** | 1 |
| `rounded-2xl` | **0** | 0 |
| `rounded-lg` | **0** | 0 |
| `rounded-md` / `rounded-sm` | **0 / 0** | 0 / 0 |
| Radios no-cápsula en uso | **2** (`rounded-card`, `rounded-xl`) | 2 |
| Glifos `←` / `›` | **0 / 0** | 0 / 0 |
| Emoji de iconografía | **8** | 8, preservados a propósito |
| Esquinas continuas | **33** (31 directas + 2 ramas de `Card`) | 33 |
| `TABULAR_NUMS` en valores | **14** | 14 |
| Tratamiento de los 6 títulos auditados | **1** (`text-base font-bold text-foreground`) | 1 |
| Botones sólidos `rounded-xl bg-accent` | **12** | 12 |
| `useThemeColor` de heroui | **0** | 0 |
| `useThemeColors` pidiendo `'accent'` | **0** | 0 |
| Placeholders de `TextInput` sin `placeholderTextColor={muted}` | **0 de 5** | 0 |
| `TextInput` crudos con `border border-border` | **0 de 6** | 0 |
| Variantes `last:` / `first:` / `odd:` / `even:` | **0** | 0 |
| Recetas manuales de las 4 cards de R3 | **0** | 0 |
| Hex fuera de `src/theme/` | **0** | 0 |
| Clases arbitrarias `[...]` | **0** | 0 |
| `StyleSheet.create` | **0** | 0 |
| `shadowColor` / `shadowOffset` / `shadowOpacity` / `shadowRadius` / `elevation:` | **0** | 0 |

El único gradiente sigue siendo el área aprobada de `weight-chart.tsx`; esta
feature no lo tocó. No se introdujeron etiquetas duplicadas.

## Observación de tipado de R15

React Native 0.86 tipa `TextStyle.fontVariant` como array mutable. La forma
literal de la spec (`['tabular-nums']` bajo un `as const` exterior) se convierte
en tupla `readonly` y falla `tsc` en cada consumidor. R15 conserva la constante,
el valor y todos sus usos `style={TABULAR_NUMS}`, pero fija solo la tupla interna
como mutable:

```ts
export const TABULAR_NUMS = {
  fontVariant: ['tabular-nums'] as ['tabular-nums'],
} as const;
```

El ajuste está aislado en el historial (`07780bc`) y tanto Jest como typecheck
y lint quedan verdes.
