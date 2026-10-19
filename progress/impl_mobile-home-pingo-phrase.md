```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-190
$ git branch --show-current
feature/190-mobile-home-pingo-phrase
$ git rev-parse --short HEAD (H0)
845cc339
$ git status --short
(salida vacía)
```

# Implementación #190 — mobile-home-pingo-phrase

## Anclas iniciales

```text
A1: $ grep -c '^status: approved' specs/mobile-home-pingo-phrase/requirements.md
1
A2: $ grep -cF -- '- [x] Enmienda #190 de' specs/mobile-home-pingo-phrase/requirements.md
1
A3: $ grep -cF -- '- [ ] Smoke de R15' specs/mobile-home-pingo-phrase/requirements.md
1
A4: $ grep -cF 'testID="home-entrance-summary"' mobile-pet-tracker/src/screens/home/index.tsx
1
A5: $ grep -cF 'index={' mobile-pet-tracker/src/screens/home/index.tsx
6
A6: $ grep -cF 'pingo' mobile-pet-tracker/src/screens/home/index.tsx
0
A7: $ grep -cF -- '--radius-4' mobile-pet-tracker/src/theme/global.css
0
A8: $ grep -cF -- '--radius-tile: 18px' mobile-pet-tracker/src/theme/global.css
1
A9: $ grep -cF 'home.pingoPhrase' mobile-pet-tracker/src/i18n/catalog.ts
0
A10: $ grep -cF '+ 4, // #186 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
A11: $ grep -cF 'expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2 + 2); // +2 #155 R4' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
A12: $ grep -cF '+ 1 // #186 R2: utils/form-rules.ts' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
A13: $ grep -cF "'screens/forgot/index.tsx'," mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
1
A14: $ grep -cF "'screens/login/index.tsx'," mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
1
A15: $ grep -cF "it('pinta los seis envoltorios como hijos directos y en orden'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
A16: $ grep -cF "it('escalona las entradas cada 60 ms en el orden de los bloques'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
A17: $ grep -cF 'export function PingoFloat' mobile-pet-tracker/src/components/pingo-float.tsx
1
A18: $ grep -cF 'export const MOTION_PINGO_FLOAT_OFFSET_Y = 10;' mobile-pet-tracker/src/theme/motion.ts
1
A19: $ grep -cF 'export function fmtKm' mobile-pet-tracker/src/screens/home/format.ts
1
A20: $ grep -cF '## Enmienda #190' docs/ui-guidelines.md
0
A21: $ grep -cF '## Enmienda #186' docs/ui-guidelines.md
1
A22: $ test -f mobile-pet-tracker/assets/images/pingo-talk.webp && echo ok
ok
A23: $ test ! -e mobile-pet-tracker/src/screens/home/pingo-phrase.ts && test ! -e mobile-pet-tracker/src/__tests__/home-pingo-phrase.test.ts && echo ok
ok
```

## Preparación

- H0: `845cc339`; árbol limpio y branch correcta. Las 23 anclas coinciden.
- `bun install --frozen-lockfile`: exit 0; `node_modules`: presente; `.expo/types/router.d.ts`: ausente (exit 0).
- `pgrep -af '[i]nit\.sh'`: sin procesos, exit 1.
- Skills cargadas: `ponytail`, `building-native-ui` (plugin Expo), `appllama-app-design-skill`. La carta del proyecto prevalece; investigación y smoke Android quedan en leader/humano (§Skills).
- Leída documentación versionada Expo SDK 57 e Image: https://docs.expo.dev/versions/v57.0.0/ y https://docs.expo.dev/versions/v57.0.0/sdk/image/.
- No se ejecuta `init.sh`, no se abre PR ni se cambia bookkeeping: lo reserva el handoff al leader.

## Medidas de base

Medido antes del primer commit, cada fichero por separado (`FORCE_COLOR=0 bunx jest --runInBand --runTestsByPath <fichero>`, logs `/tmp/pet190-base-*.log`), todos exit 0:

| Fichero | Tests |
|---|---:|
| `src/screens/home/index.test.tsx` | 230 |
| `src/screens/home/home-entrance.test.tsx` | 7 |
| `src/theme/__tests__/motion.test.ts` | 25 |
| `src/providers/__tests__/language-provider.test.tsx` | 47 |
| `src/__tests__/ui-language.test.ts` | 30 |
| `src/__tests__/alerts-canvas-fidelity.test.ts` | 27 |
| `src/components/__tests__/pingo-float.test.tsx` | 5 |

`FORCE_COLOR=0 bun run test --runInBand` (una vez de base, sin pipe): exit 0.

```text
Test Suites: 124 passed, 124 total
Tests:       4149 passed, 4149 total
```

Log: `/tmp/pet190-base-full.log`.

Supuestos confirmados antes de los rojos: compilación Tailwind + compilador nativo Uniwind 1.11.0 con el token añadido en memoria: `rounded-br-4` → `borderBottomRightRadius: 4`, `leading-5.25` → `lineHeight: 21`. Script y log en `/tmp/pet190-uniwind-check.*`; se resolvieron sus alias internos mediante tsconfig temporal fuera del árbol. La forma `source: [{ testUri: ...pingo-talk.webp }]` ya la ejecutó en verde el test «pinta la pose» de la base de Inicio.

## Ejecución por requisito

Orden: R9, R8, R11, R1, R2, R3, R4, R6, R10, R7, R13, R12, R5, R14.

- R9 rojo `f6240159`: 9 fallos esperados (cuatro claves ausentes y recuento 429 frente a 433); tsc exit 0. Logs `/tmp/pet190-R9-red*.log`.
- R9 verde `4b4990cf`: 55/55 tests (dos suites), tsc exit 0.
- R8 rojo `bd12aaff`: 14 fallos esperados por módulo todavía inexistente; R9 sigue verde. Verde `ea7071f0`: 22/22, tsc exit 0 en ambas cadenas.
- R11 rojo `8e4387dc`: faltan burbuja y token (2 fallos); 230 tests anteriores de Inicio pasan. La receta se monta primero dentro del resumen y R1 la moverá a su entrada propia; así se prueba R11 antes de implementar R1 según el orden exigido.
- R11 verde `21c6c350`: 232/232 (Inicio + candado nuevo), tsc exit 0. `View` conserva `CONTINUOUS_CORNER`.
- Dependencia de inventarios R1/R6: para que el verde R1 pueda pasar la suite entera de Inicio, la igualdad exacta de hijos de `home-content` y `homeEnteringIds` deben admitir la entrada nueva ya en su rojo R1. Se conservan todos los ids y el orden; se añade únicamente Pingo, con comentario `(enmendado por #190 R1)`. El resto de R6 (siete retrasos y ausencia de bloques) sigue en su turno. No sería posible introducir un séptimo hijo en R1 y conservar simultáneamente la expectativa de seis hasta R6.
- R1 rojo `a17112f3`: 7 fallos esperados (4 escenarios R1 y 3 inventarios de entrada); verde `cd54083c`: 235/235, tsc exit 0.
- R2 rojo `da577a0c`: 4 fallos esperados, por detalle error/unreachable y por lista cargando/error con selección conservada. Las otras 5 filas ya estaban cubiertas parcialmente por R1 o la rama vacía; no se fabricó un rojo para ellas. Se espera siempre un nodo positivo del escenario.
