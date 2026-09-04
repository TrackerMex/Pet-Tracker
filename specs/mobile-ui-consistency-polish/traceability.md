---
feature: "mobile-ui-consistency-polish"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-ui-consistency-polish]]

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-ui-consistency): <desc> (R1,R2)`.
El implementer (Codex CLI) actualiza esta tabla tras cada commit; el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5).

## R-id → criterio de aceptación → test → hallazgo del audit

| Requisito | Criterio de aceptación (#62 en `feature_list.json`) | Test (archivo::describe) | Hallazgo audit | Commit |
|---|---|---|---|---|
| R1 | AC1 — "el botón primario sólido un único radio; la escala de radios queda declarada como regla en docs/ui-guidelines.md, no solo como token suelto" | `src/__tests__/consistency-classnames.test.ts::#62 R1: la escala de radios está declarada y el botón primario tiene un solo radio` | **10**, **23** (regla) | `8732d69` (rojo `b6ffba4`) |
| R2 | AC2 — "Cada skeleton tiene la forma del contenido que sustituye: mismo radio" | `src/__tests__/consistency-classnames.test.ts::#62 R2: cada skeleton tiene la forma del contenido que sustituye` | **8** | `6961833` (rojo `ebca8e0`) |
| R3 | AC3 — "Las cuatro superficies con receta de card a mano pasan a usar el Card compartido de src/components/card.tsx, sin añadir un variant nuevo salvo que la spec justifique por qué ninguno de los tres existentes sirve" | `src/app/(tabs)/__tests__/home.test.tsx::#62 R3: collar-card y last-position-card usan el Card compartido` + `src/app/(tabs)/__tests__/food.test.tsx::#62 R3: los avisos de plan usan el Card compartido` + `src/app/(tabs)/__tests__/map.test.tsx::#62 R3: el overlay vacío del mapa usa el Card compartido` | **22** | `4078c42` (rojo `2357828`) |
| R4 | AC1 — misma intención: la escala declarada se aplica, no solo se escribe | `src/__tests__/consistency-classnames.test.ts::#62 R4: la app solo usa los radios de la escala declarada` | **23** | `cb14e6d` (rojo `d67215f`) |
| R5 | AC1 — "El título de card usa un único tratamiento en toda la app, declarado por escrito en la spec" | `src/app/(tabs)/__tests__/home.test.tsx`, `.../health.test.tsx`, `.../food.test.tsx`, `.../meal-schedule.test.tsx` — en los cuatro, `::#62 R5: el título de card usa un único tratamiento` | **9** | `c020867` (rojo `760f9da`) |
| R6 | Sin AC propio — es el hallazgo 11, que la `description` de #62 enumera en alcance ("last:border-b-0 es variante muerta… la última fila de la card conserva su separador colgando") | `src/screens/profile/index.test.tsx::#62 R6: la última fila de pet-info-card no cuelga su separador` | **11** | `338de85` (rojo `3a63cb5`) |
| R7 | AC5 — "Cero glifos tipográficos haciendo de iconografía" | `src/__tests__/consistency-classnames.test.ts::#62 R7: ningún glifo tipográfico hace de icono` | **12** | `fd08d24` (rojo `7c65979`) |
| R8 | AC2 — "y en home el Spinner deja de mover lo que tiene debajo al resolverse" | `src/app/(tabs)/__tests__/home.test.tsx::#62 R8: home carga con Skeleton dimensionado, no con Spinner suelto` | **17** | `c481561` (rojo `9c78cea`; ajuste de test `4d7bcbf`) |
| R9 | Sin AC propio — es el hallazgo 20, que la `description` de #62 enumera en alcance ("WeightChart desnudo sobre el fondo, sin la card que le da el diseño") | `src/app/(tabs)/__tests__/weight-log.test.tsx::#62 R9: la gráfica de peso vive dentro de una card` | **20** | `4ae75d6` (rojo `e8a1bfd`; ajuste de fixture `5752023`) |
| R10 | Sin AC propio — es el hallazgo 24, que la `description` de #62 enumera en alcance ("el tipo de documento como micro-label gris cuando el diseño lo trata como badge de color") | `src/screens/docs/index.test.tsx::#62 R10: el tipo de documento se lee como badge` | **24** | `7bac892` (rojo `2d04b61`) |
| R11 | Sin AC propio — es el hallazgo 25, que la `description` de #62 enumera en alcance ("dos tamaños para el mismo chip dentro de add-pet") | `src/screens/add-pet/index.test.tsx::#62 R11: los chips de especie usan la receta única de chip` | **25** | `42c8c80` (rojo `5243e2a`) |
| R12 | AC4 — "Ningún placeholder queda ilegible en tema oscuro: los TextInput crudos de add-pet y add-reminder resuelven el color del placeholder desde el tema, y un test lo fija" | `src/screens/add-reminder/index.test.tsx::#62 R12: el placeholder del formulario sale del tema` + `src/screens/add-pet/index.test.tsx::#62 R12: el placeholder del formulario sale del tema` + `src/__tests__/consistency-classnames.test.ts::#62 R12: los TextInput crudos comparten una sola receta` | **16** | `cc1d927` (rojo `200fbe8`) |
| R13 | AC5 — "y cero usos de useThemeColor de heroui en src/" | `src/__tests__/consistency-classnames.test.ts::#62 R13: el color imperativo sale siempre de useThemeColors del repo` | **26** | `35a1978` (rojo `22d2851`) |
| R14 | AC6 — "borderCurve continuous en toda esquina redondeada no-cápsula" | `src/__tests__/consistency-classnames.test.ts::#62 R14: toda esquina no-cápsula que dibuja el repo es continua` + `src/components/__tests__/card.test.tsx::#62 R14: el Card compartido fusiona borderCurve con el style del llamador` | **14** | pendiente |
| R15 | AC6 — "y tabular-nums en todo contador, empezando por el overlay del mapa" | `src/__tests__/consistency-classnames.test.ts::#62 R15: todo contador usa cifras tabulares` + `src/app/(tabs)/__tests__/map.test.tsx::#62 R15: el overlay del mapa usa cifras tabulares` | **15** | pendiente |
| R16 | AC7 — "Suite móvil completa verde sin reescribir ningún assert de conducta; el grep-clean de #46 y #72 sigue intacto" + AC5 (segunda mitad) — "los conteos del audit se rehacen y quedan en el reporte del reviewer" | Gate mecánico del `reviewer`: `bun test` + `git diff origin/main...HEAD --stat` + los greps de [[design]] §5 (no es un test de jest) | — (invariante de #46/#61) | pendiente |

## Criterios de aceptación sin R-id propio

| Criterio | Cobertura | Estado |
|---|---|---|
| AC8 — "Gate humano: smoke en dev build de Android comparando lado a lado con el Figma en los dos temas. **No delegable a IA**" | **Sin R-id: no es automatizable.** Guion de 13 puntos en [[tasks]] §Cierre. El `leader` no puede marcar la feature `done` hasta que el humano lo cierre, aunque el `reviewer` haya aprobado | pendiente |

Los ocho criterios quedan cubiertos: AC1→R1+R4+R5, AC2→R2+R8, AC3→R3,
AC4→R12, AC5→R7+R13+R16, AC6→R14+R15, AC7→R16, AC8→gate humano.

## Cobertura de los hallazgos en alcance

| Hallazgo | Requisito | |
|---|---|---|
| 8 | R2 | ✔ |
| 9 | R5 | ✔ |
| 10 | R1 | ✔ |
| 11 | R6 | ✔ |
| 12 | R7 (7 glifos, no 5: `pairing` y el tercer `›` de `profile` los añadió #42) | ✔ |
| 14 | R14 (33 sitios; heroui ya trae los suyos, las cápsulas quedan fuera — [[design]] §2 D8) | ✔ |
| 15 | R15 (14 contadores, no 13: `weight-variation` añadido; `stat-gps` excluido por no ser numérico) | ✔ |
| 16 | R12 (5 `TextInput` con placeholder, no 8: los otros 3 eran `Pressable` pseudo-campo) | ✔ |
| 17 | R8 | ✔ |
| 20 | R9 | ✔ |
| 22 | R3 (las 4; `weight-row-*` y `pet-card-error` quedan fuera, [[design]] §2 D4) | ✔ |
| 23 | R1 (la regla) + R4 (los sitios) | ✔ |
| 24 | R10 | ✔ |
| 25 | R11 | ✔ |
| 26 | R13 | ✔ |

Hallazgos 1-7, 13, 19 y 21: **fuera de alcance**, son la feature #61, ya
implementada y mergeada. Hallazgo 18: cerrado por decisión humana del
2026-09-03, ver [[design]] §9.

## Divergencias con la evidencia del audit, declaradas

El audit se escribió el 2026-09-03 y desde entonces se mergearon #61 y #42.
Estas cifras cambiaron y la spec usa las verificadas el **2026-09-04** sobre
`b222d33`:

| Dato del audit | Valor en el audit | Valor verificado | Por qué |
|---|---|---|---|
| Glifos tipográficos | 5 | **7** | #42 añadió `pairing/index.tsx:240` y el tercer `›` de `profile/index.tsx:310` |
| `TextInput` crudos en add-pet + add-reminder | 8 | **5** con `placeholder` (+1 en `pairing`, sin placeholder) | Los otros 3 del conteo eran `Pressable` pseudo-campo (`date-field`, `time-field`, `birth-date-field`), no `TextInput` |
| Botones primarios con `bg-accent` | 9 | **12** | #42 añadió 2 en `pairing` y #61 dejó los demás intactos |
| Contadores para `tabular-nums` | 13 | **14** | `health.tsx:223` (`weight-variation`) renderiza el mismo `fmtVariation` que `weight-log.tsx:265`, que el audit sí lista |
| `borderCurve` en `floating-tab-bar.tsx:111` | propuesto | **descartado** | Es `rounded-full`, una cápsula; la micro-regla es explícitamente "no-cápsula" |
| Hallazgo 22: arreglo propuesto | alinear el radio | **migrar al `Card` compartido** | El criterio de aceptación 3 de #62 lo pide explícitamente y es más fuerte que la propuesta del audit |
| Hallazgo 16: arreglo propuesto | quitar `border border-border` | **eso + `placeholderTextColor`** | La `description` de #62 amplió el hallazgo el 2026-09-04 tras el smoke: el placeholder ilegible en dark es un defecto real, no consistencia |
| Hallazgo 26: arreglo propuesto | `useThemeColors(['accent'])` | **`useThemeColors(['accent-strong'])`** | `['accent']` rompería el invariante ya verde de #61 R4, y el icono se pinta encima de `bg-accent-soft` |
