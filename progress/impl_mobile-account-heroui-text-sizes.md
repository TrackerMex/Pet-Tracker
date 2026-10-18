# Implementación — mobile-account-heroui-text-sizes (#187)

R1–R5 implementados y verificados. R6 (smoke Android) sigue reservado al humano, sin tocar su casilla. Fecha: 2026-10-18.

## Base, alcance y skills

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-187`.
- Rama: `feature/187-mobile-account-heroui-text-sizes`.
- H0: `ca57f13b3b70acd3afdce507a92c68d70052f8da`, conservado durante todas las reanudaciones.
- D1 aprobada: Text plano de react-native. Cambios de producción: doce etiquetas y cinco botones; se conserva cada receta y el resto de props.
- T0 se midió una sola vez en H0, sin código tocado y sin pipe. No se repitió.

```text
Test Suites: 113 passed, 113 total
Tests:       3748 passed, 3748 total
Snapshots:   1 passed, 1 total
Time:        102.811 s, estimated 188 s
```

Salida T0: 0. `A worker process has failed to exit gracefully` apareció una vez; se contó solo en esta medida.

Total final derivado: **3748 + 42 = 3790 it**. Delta medido en las suites afectadas: 216 basales → 258 finales, todos verdes al cierre. No se volvió a correr ALL ni `init.sh`; el leader/humano ejecuta el harness completo.

Skills leídas:

- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `expo-tailwind-setup`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/expo-tailwind-setup/SKILL.md`.
- `ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.2/skills/ponytail/SKILL.md`.

Las dos skills Expo se encontraron en el caché local. La guía Tailwind describe NativeWind; se mantuvo la configuración Uniwind del repo, sin instalar ni migrar dependencias. No se cargaron appllama, animación ni una skill de auditoría AST. Se leyó la documentación versionada [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) por instrucción de `mobile-pet-tracker/AGENTS.md`.

## Anclas A1–A11

Todas coincidieron en H0. Orden: login, register, forgot, reset-password.

| Ancla | Medida inicial |
|---|---|
| A1 | 2 / 7 / 1 / 2 |
| A2 | 1 / 1 / 1 / 1 |
| A3 | 0 / 0 / 1 / 0 |
| A4 | 17 |
| A5 | forgot, login, register, reset-password (cuatro index.tsx, en ese orden) |
| A6 | 0 0 0 en las cuatro |
| A7 | import de Text de react-native: 1 en cada pantalla |
| A8 | 2 1 / 7 1 / 1 2 / 2 1 |
| A9 | solo src/components/card.tsx importa tailwind-merge |
| A10 | heroui-native 1.0.8; tailwind-merge ^3.6.0; tailwind-variants ^3.3.1; uniwind ^1.11.0 |
| A11 | 2xs=10px; 13=13px; 15=15px; 17=17px; 22=22px; 26=26px; 11=11px |

Tras c3: las doce etiquetas son Text; quedan cinco Button.Label. Tras c5: no quedan Label.Text ni Button.Label en las cuatro pantallas; A4=0. A6 final: login 2/1/0, register 7/1/0, forgot 1/1/1, reset-password 2/1/0.

## Commits

Cada hash siguiente se verificó con `git cat-file -e`. Ningún rebase, amend ni merge. Los commits de test y sus implementaciones están separados.

| Id | Hash | Mensaje |
|---|---|---|
| c1 | `6d2096456cc8784eaff5d0256129e08875ae645a` | `test(#187 R1): candado de familia text-NN sobre HeroUI y Card (R1)` |
| c2 | `33a6740402e5cba166e59d22805b85b6159256ba` | `test(#187 R2): doce etiquetas de campo a 13 px y literal 3 de textRecipes (R2)` |
| c2b | `9c0d0e485b4f42caab4736d6b836e96384b5c3a2` | `test(#187 R1): piso HeroUI a 227 al salir 17 elementos de HeroUI (R1)` |
| c2c | `e613944dee9a8bd88b951b3d202e3105c0effbd5` | `test(#187 R1): piso className a 181 al salir 17 elementos del recuento (R1)` |
| c3 | `4f177bd5067cc3550e449388ae61d382da294371` | `feat(#187 R2): etiquetas de cuenta con Text plano (R2)` |
| c4 | `f4d0b7830dc91ca7dce084f3b6b67a9ffad9de95` | `test(#187 R3): cinco botones de cuenta a 17 px y literales 10 y 11 (R3)` |
| c5 | `f637704dc747f2d799eeedb1c0b3b2914c56c459` | `feat(#187 R3): botones de cuenta con Text plano (R3)` |
| c6 | `a83a17b7fad01c29a17be2603b0ae8a9153c9c67` | `test(#187 R5): la carta fija la regla de text-NN sobre HeroUI (R5)` |
| c7 | `820f7f1b970f46a1ae60b56fddd7c500b0b6cca2` | `docs(#187 R5): enmienda de la carta sobre text-NN y HeroUI (R5)` |
| c8 | Este commit; identificador reproducible abajo | `docs(#187): trazabilidad y reporte de implementación (R1-R5)` |

El hash de c8 identifica el propio commit que contiene este reporte. Insertarlo literalmente dentro de ese mismo commit cambiaría el hash. Se obtiene sin ambigüedad con `git log -1 --format=%H -- progress/impl_mobile-account-heroui-text-sizes.md` (y se comunica en el cierre). Esta es la única limitación del listado de hashes del reporte; c1–c7 y c2b/c2c sí quedan escritos literalmente.

c2b y c2c son commits adicionales, autorizados expresamente por el humano:

- c2b: solo piso HeroUI 244 → 227; los 17 elementos retirados son doce Label.Text y cinco Button.Label.
- c2c: solo piso classNameElements 198 → 181, por las mismas diecisiete sustituciones.
- Se conservaron los pisos de ficheros (28) y Card local (42). La enmienda formal de requirements/design/tasks queda al leader; no se editaron esas specs.
- Antes de cada enmienda se guardó c3 con `git stash push -m "wip-187-c3" -- mobile-pet-tracker/src/screens`, se confirmó el mensaje en `git stash list`, y tras el commit test-only se recuperó con `git stash pop`, sin conflictos. El stash ajeno no se manipuló.

## Resultados por fichero y commit

Cada celda ejecutada conserva literalmente la línea `Tests:`. «—» significa no repetido en ese paso. Todos los Jest se ejecutaron de uno en uno con el `cd` prescrito.

| Estado | heroui-text-size-merge | account-screens-polish | login | register | forgot | reset-password |
|---|---|---|---|---|---|---|
| base | — | `Tests:       13 passed, 13 total` | `Tests:       40 passed, 40 total` | `Tests:       65 passed, 65 total` | `Tests:       49 passed, 49 total` | `Tests:       49 passed, 49 total` |
| c1 | `Tests:       1 failed, 23 passed, 24 total` | — | — | — | — | — |
| c2 | `Tests:       1 failed, 23 passed, 24 total` | `Tests:       4 failed, 9 passed, 13 total` | `Tests:       2 failed, 40 passed, 42 total` | `Tests:       7 failed, 65 passed, 72 total` | `Tests:       1 failed, 49 passed, 50 total` | `Tests:       2 failed, 49 passed, 51 total` |
| c2b | `Tests:       1 failed, 23 passed, 24 total` | — | — | — | — | — |
| c2c | `Tests:       1 failed, 23 passed, 24 total` | — | — | — | — | — |
| c3 | `Tests:       1 failed, 23 passed, 24 total` | `Tests:       13 passed, 13 total` | `Tests:       42 passed, 42 total` | `Tests:       72 passed, 72 total` | `Tests:       50 passed, 50 total` | `Tests:       51 passed, 51 total` |
| c4 | `Tests:       1 failed, 23 passed, 24 total` | `Tests:       4 failed, 9 passed, 13 total` | `Tests:       1 failed, 42 passed, 43 total` | `Tests:       1 failed, 72 passed, 73 total` | `Tests:       2 failed, 50 passed, 52 total` | `Tests:       1 failed, 51 passed, 52 total` |
| c5 | `Tests:       24 passed, 24 total` | `Tests:       13 passed, 13 total` | `Tests:       43 passed, 43 total` | `Tests:       73 passed, 73 total` | `Tests:       52 passed, 52 total` | `Tests:       52 passed, 52 total` |
| c6 | `Tests:       1 failed, 24 passed, 25 total` | — | — | — | — | — |
| c7 | `Tests:       25 passed, 25 total` | `Tests:       13 passed, 13 total` | — | — | — | — |
| c8 | `Tests:       25 passed, 25 total` | `Tests:       13 passed, 13 total` | `Tests:       43 passed, 43 total` | `Tests:       73 passed, 73 total` | `Tests:       52 passed, 52 total` | `Tests:       52 passed, 52 total` |

Las cinco suites basales se midieron antes de c1 y no cambiaron por ese commit. En c2b/c2c solo se repitió el candado. En c6 solo se añadió el test R5; las cinco suites de cuenta conservaron su estado c5 y se volvieron a medir verdes en c8.

c1: solo el árbol falla con 17 hallazgos (forgot 3, login 3, register 8, reset-password 3); los otros 23 tests nacen verdes como prescribe la spec.
c2: exactamente 17 rojos. Las doce etiquetas esperan `text-13 font-semibold text-muted` y reciben `label__text font-semibold text-muted`. Las filas de #172 R6 esperan 2/7/1/2 y reciben 0. El árbol conserva 17 hallazgos.
c3: solo el árbol falla, con cinco Button.Label. Las doce etiquetas y los demás tests pasan.
c4: exactamente diez rojos. Los cinco botones reciben `button__label button__label--variant-primary button__label--size-md font-extrabold text-accent-foreground` (secundario: `button__label--variant-secondary` y `text-foreground`) frente a las recetas Text exactas. #172 R6 espera 1 en cada pantalla y recibe 0. El árbol conserva cinco hallazgos.
c5: todos verdes; cero hallazgos. c6: solo R5 falla en `toContain` del encabezado ausente. c7 y c8: verdes. Ningún test anterior se borró ni se renombró; los tres vectores de recetas conservaron sus cuentas.

## Invariantes y medidas

En c1, c2, c3, c4 y c5 se ejecutaron por separado y sin editar:

- profile-canvas-fidelity: `Tests:       26 passed, 26 total` en cada paso.
- design-drift: `Tests:       112 passed, 112 total` en cada paso.

Guardas tras la enmienda c7:

| Fichero | Resumen literal |
|---|---|
| drift | `Tests:       112 passed, 112 total` |
| legibility | `Tests:       27 passed, 27 total` |
| consistency | `Tests:       71 passed, 71 total` |
| language | `Tests:       30 passed, 30 total` |
| profile | `Tests:       26 passed, 26 total` |
| account | `Tests:       13 passed, 13 total` |

Medida tras el commit c5 mediante las mismas funciones `sourceFiles`/`scan` del candado, sin modificar el test:

```json
{"heroElements": 227, "heroFiles": 29, "cardElements": 42, "classNameElements": 181}
```

HeroUI=227 y className=181 son exactos, no solo pisos. Los otros recuentos fueron 29 ficheros (piso 28) y 42 Card locales (piso 42).

Antes de c1, c2, c2b, c2c y c3–c8 pasaron el guard de ausencia de `.expo/types/router.d.ts`, `bun run typecheck` (salida 0) y el lint sin caché prescrito (salida 0 y log vacío). No hubo mensajes `Failed to run`, ni reintentos de lint, ni formatter. Los resúmenes rojos se registraron en cadena `&&` antes de los commits de test.

`git diff --quiet H0 -- src/theme/global.css package.json bun.lock` desde móvil: salida 0. La carta conserva su prefijo de H0 byte a byte y añade únicamente ocho líneas al final. El diff final contiene exactamente los trece ficheros autorizados; no se modificaron los archivos de estado del leader.

## Sondas S1–S17

Cada mutación fue temporal. Después se ejecutó `git checkout HEAD -- <ruta>` y ambos `git diff --quiet -- <ruta>` y `git diff --cached --quiet -- <ruta>` con salida 0. Excepción prescrita: S4 crea un fichero nuevo, se eliminó `src/components/zz-sonda.tsx` y se comprobaron ambos diffs.

| Sonda | Resultado y Expected/Received |
|---|---|
| S1 | R1 `1 failed, 23 passed, 24 total`, Received `["screens/login/index.tsx Label.Text text-13"]` frente a `[]`; login `1 failed, 42 passed, 43 total`, receta Text frente a `label__text font-semibold text-muted`; account `1 failed, 12 passed, 13 total`, Expected 2 / Received 1. A4=1. |
| S2 | R1 `1 failed, 23 passed, 24 total`; Expected `[]` / Received `["screens/forgot/index.tsx Button.Label text-17"]`. A4=0 sobre el tag multilínea. |
| S3 | R1 `1 failed, 23 passed, 24 total`; Expected `[]` / Received `["screens/home/index.tsx HeroUICard text-13"]`, plantilla con alias. |
| S4 | R1 `1 failed, 23 passed, 24 total`; Expected `[]` / Received `["components/zz-sonda.tsx Button.Label text-15"]`; fichero nuevo descubierto. |
| S5 | R1 `1 failed, 23 passed, 24 total`; Expected `[]` / Received `["screens/home/index.tsx Card text-13"]`; Card local. |
| S6 | R1 `24 passed, 24 total`: JSX añadido temporalmente en un test queda excluido. |
| S7 | `4 failed, 20 passed, 24 total`: árbol + P4/P5/P6; cada P Expected length 1 / Received length 0. |
| S8 | `2 failed, 22 passed, 24 total`: árbol + P3; Expected length 1 / Received length 0. |
| S9 | `3 failed, 21 passed, 24 total`: árbol + P9 (1 / 0) + it 2 (Expected >=198 / Received 196). Colateral aceptado por humano. |
| S10 | `2 failed, 22 passed, 24 total`: árbol + P10; Expected length 1 / Received length 0. |
| S11 | `3 failed, 21 passed, 24 total`: árbol + P12/P13; cada P Expected length 1 / Received length 0. |
| S12 | `3 failed, 21 passed, 24 total`: árbol + P7/P8; cada P Expected length 2 / Received length 0. |
| S13 | `3 failed, 21 passed, 24 total`: árbol + P11 (1 / 0) + it 2 (Expected >=42 / Received 0). |
| S14 | `3 failed, 21 passed, 24 total`: árbol + it 2 (Expected >=28 / Received 22) + it 4 (Expected `["components/password-input.tsx InputGroup.Input"]` / Received `[]`). Colateral aceptado por humano sin repetir. |
| S15 | `9 failed, 15 passed, 24 total`: árbol + N2/N3 + P1/P2/P3/P7/P12/P13. Detalle de cada colateral debajo. Aceptada por humano sin repetir. |
| S16 | `2 failed, 22 passed, 24 total`: árbol + it 5, `toBe`: Expected `"text-13 font-semibold text-muted"` / Received `"font-semibold text-muted"`. |
| S17 | `2 failed, 22 passed, 24 total`: árbol + it 4, Expected `["components/password-input.tsx InputGroup.Input"]` / Received `["components/password-input.tsx InputGroup.Input", "screens/login/index.tsx Button"]`. |

S7–S17 se midieron tras c1 antes de c2; S1–S6 tras c5. En las sondas posteriores sobre el escáner se incluyó el fichero R1 completo, sin filtros. El rojo previo del árbol recibió los 17 hallazgos iniciales, siempre frente a `[]`, en S7–S17.

S15 amplió el patrón a cualquier `text-<palabra>` y contó también colores. Expected/Received literales de longitud, con tokens del Received:

| it | Expected length | Received length | Tokens |
|---|---|---|---|
| P1 | 1 | 2 | text-17, text-accent-foreground |
| P2 | 1 | 2 | text-17, text-accent-foreground |
| P3 | 1 | 2 | text-13, text-muted |
| P7 | 2 | 4 | text-13, text-danger, text-13, text-muted |
| P12 | 1 | 2 | dark:text-13, text-muted |
| P13 | 1 | 2 | text-13.5, text-muted |
| N2 | 0 | 2 | text-xs, text-accent-foreground |
| N3 | 0 | 4 | text-2xs, text-muted, text-2xl, text-muted |

## Paradas y desviaciones resueltas

1. Lectura exploratoria de `jest.config.js` inexistente: se paró sin código; el humano aclaró que estas lecturas no son errores de invocación de la cadena. Se reanudó sin repetir T0 ni anclas.
2. S9: colateral it 2, >=198 / 196. Se restauró; el humano aceptó la desviación.
3. S14: colaterales it 2 e it 4, con valores en la tabla. Se restauró; el humano aceptó sin repetir.
4. S15: colaterales del corpus positivo, con valores en la tabla. Se restauró; el humano aceptó sin repetir.
5. Primer intento de c3: `2 failed, 22 passed, 24 total`, it 2 Expected >=244 / Received 232. Las cinco suites de cuenta estaban verdes. El humano autorizó c2b, test-only, antes de recuperar c3.
6. Segundo intento de c3 tras c2b: `2 failed, 22 passed, 24 total`, it 2 Expected >=198 / Received 186. El humano autorizó c2c, test-only. Después c3 dio el rojo único previsto y se creó con su mensaje exacto.
7. Lecturas auxiliares de logs antes de su creación y un extractor auxiliar que omitía la indentación de Jest fallaron durante el registro. Se inspeccionaron los logs y corrigió la lectura, sin cambiar las aserciones del test. No fueron errores de los comandos prescritos ni nuevos rojos de Jest.
8. El marcador de la primera parada se había consumido al reanudar. No se creó otro durante las paradas. El marcador definitivo se crea únicamente al terminar c8 y todas las comprobaciones.

## Cierre y límites

R1: 24 it del escáner, hallazgos 17 → 5 → 0. R2: 12 it de etiquetas. R3: 5 it de botones. R5: 1 it de carta. Total añadido: 42.
R4: guards verdes e intactos, sin cambios de tokens ni dependencias. Alcance: trece archivos. Trazabilidad R1–R5 con hashes reales, incluidos c2b/c2c. R6 conserva su fila pendiente y su casilla sin marcar: solo el humano puede cerrarlo.
No hubo sandbox denegado. No se ejecutaron init.sh, recursos AWS, deploy, PR, push ni rebase. No se editaron progress/current.md, progress/history.md, STATUS.md ni feature_list.json. Las únicas specs editadas son la trazabilidad autorizada; los requisitos, diseño y tareas quedan al leader.
Los logs y scripts temporales se eliminan antes del marcador. El marcador ignorado por Git contiene una sola línea: `progress/impl_mobile-account-heroui-text-sizes.md`.
