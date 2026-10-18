# Implementación #180 — mobile-alert-detail-canvas-fidelity

**Estado: BLOQUEADO por contradicciones de la spec y del orden TDD. H0 completado; ningún R implementado.**

## Arranque

- Fecha: 2026-10-18 UTC.
- `pwd`: `/home/claude/sites/Pet-Tracker-wt-180`.
- Rama: `feature/180-mobile-alert-detail-canvas-fidelity`.
- H0 (commit del handoff y HEAD inicial): `da0a377eb50eedb6f96031e5086e78aec2a671ea`.
- `git fetch origin` y `git merge origin/main`: OK, Already up to date.
- P1–P14: todas conformes; P10 router.d.ts ausente.
- Skills cargadas: `ponytail:ponytail`, `building-native-ui`, `expo-tailwind-setup`, `appllama-app-design-skill`, `animate-expo`.
- No se ejecuta init.sh; no se modifican archivos reservados al leader.

## Medidas H0

| Medida | Base |
|---|---:|
| M1 | 7 |
| M2 | 1 |
| M3 | 0 |
| M4 | 10 |
| M5 | 3 |
| M6 | 1 |
| M7 | 4 |
| M8 | 11 |
| M9 | 1 |
| M10 | 5 |
| M11 | 9 |
| M12 | 6 |
| M13 | 2 |
| M14 | 13 |
| M15 | 12 |
| M16 | 14 |
| M17 | 34 |
| M18 | 1 |
| M19 | 2 |
| M20 | 11 |
| M21 | 3 |
| M22 | 1 |
| M23 | 0 |
| M24 | 0 |
| M25 | 1 |

## Anclas y literales H0

- `mobile-alert-detail-screen` / `### R3 — El detalle pinta la alerta desde la caché del listado`: 1.
- `mobile-alert-detail-screen` / `### R4 — Carga, error y salida sin la alerta`: 1.
- `mobile-alerts-grouped-and-detail-map` / `- **R6 — Severidad en el detalle.**`: 1.
- `mobile-alerts-grouped-and-detail-map` / `- **R8 — Mini-mapa.**`: 1.
- `mobile-alerts-grouped-and-detail-map` / `- **R10 — Distancia a la zona.**`: 1.
- `mobile-alerts-grouped-and-detail-map` / `- **R15 — CTA «Ver en el mapa».**`: 1.
- `mobile-reminders-alerts-to-stack` / `### R4 — Cabecera nativa con el look de #95`: 1.
- `mobile-reminders-alerts-to-stack` / `### R6 — Métricas bajo cabecera nativa (A11)`: 1.
- `mobile-chunky-cta` / `### R2. Todo primario sólido lleva el labio`: 1.
- `mobile-tab-screens-canvas-fidelity` / `- **R2.2**`: 1.
- `mobile-tab-screens-canvas-fidelity` / `- **R2.4**`: 1.
- `mobile-tab-screens-canvas-fidelity` / `- **R3.3**`: 1.
- `mobile-alerts-canvas-fidelity` / `### R11 — Enmiendas a la carta y a specs aprobadas`: 1.
- `mobile-alerts-canvas-fidelity` / `### R12 — Candados agregados y grep-limpio`: 1.
- `mobile-chunky-cta` / `### R3. El secundario neutro lleva el labio gris`: 1.

- LP: `+ 9, // #183 R1` (línea 75).
- K7: `toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1 - 1 - 1 - 1)` (línea 102). E1: delta 0.
- K1: `title: 't:alerts.detailTitle'` (línea 429).
- Secciones de ui-language: 34; sección siguiente §2.35.
- Última enmienda de la carta: `## Enmienda #174 — Alertas fieles al canvas`.

## Sondas H0 (completadas)

- Paso 5: `alert-detail.navigation` (1 test), `alert-detail.notification` (1), `detail-stack` (18) y `detail-stack.guard` (19), todas verdes. No hizo falta añadir dobles de Reanimated. La navegación emite avisos de act preexistentes.
- Paso 6, Card real: verde. Clase final `rounded-hero p-4.5 bg-category-rose`; `bg-surface-secondary` expulsada. Se mantiene Card hero, sin fallback a View.
- Paso 7: P11–P14 y M21–M25 registrados arriba; M14 delta 0 por E1.
- Referencia versionada leída por mobile-pet-tracker/AGENTS.md: https://docs.expo.dev/versions/v57.0.0/ y https://docs.expo.dev/versions/v57.0.0/sdk/blur-view/.

- Paso 8, `BlurView` real con `intensity={48}` bajo Jest: verde (1 test). Reejecutadas después las cuatro suites de ruta: 1 + 1 + 18 + 19 tests verdes. No hizo falta añadir dobles de expo-blur.
- Paso 9, ping temporal con el doble de Welcome (`withRepeat` identidad, Reanimated real para `withTiming`) y `{ duration: 1800, ...MOTION_CELEBRATION_EASE_OUT }`: verde (1 test).
  - 0 ms: `{ opacity: 0.55, transform: [{ scale: 0.55 }] }`.
  - 900 ms: `{ opacity: 0.17344624691489657, transform: [{ scale: 1.2004110280560878 }] }`.
  - 1900 ms: `{ opacity: 0, transform: [{ scale: 1.5 }] }`.
  - `render` y `act` con await, avance de temporizadores acumulado 0 / 900 / 1000 ms.
- Paso 10: `node -e "console.log(['MOTION_ALERT_PING_MS','MOTION_BLINK_INTERVAL_MS'].sort())"` devuelve `['MOTION_ALERT_PING_MS', 'MOTION_BLINK_INTERVAL_MS']`: el token nuevo va primero.
- Antes de cada ejecución de Jest se comprobaron vacíos los dos `pgrep` exigidos. No hubo denegaciones del sandbox.
- Sondas temporales en `mobile-pet-tracker/test/scratchpad-180/`, eliminadas al cerrar y nunca commiteadas.

## Bloqueos que requieren corrección del contrato por el leader

El handoff ordena: «Si algo no cuadra con la spec, PARA y reporta antes de improvisar». Se detiene antes de R1, al detectar estas incompatibilidades durante la lectura de H0.

### B1 — El verde de R3 depende de R5, R6, R7 y R10, que van después

- `requirements.md` R3.7 (líneas 222–226) exige un candado sobre **todo** `src/screens/alert-detail/index.tsx`: cero coincidencias de las clases antiguas y una sola de `bg-default`.
- `tasks.md` R3 (líneas 80–86) sitúa ese test en el rojo de R3 y exige `M20 = 1` en su verde, antes de R4/R5/R6/R7/R10.
- En H0 estas clases siguen siendo necesarias para los requisitos posteriores:

| Código en H0 | Clases que R3.7 prohíbe | Paso que las retira |
|---|---|---|
| `index.tsx:42`, mapa | `h-52`, `rounded-card` | R5 |
| `index.tsx:53`, distancia | `text-sm` | R5 |
| `index.tsx:163`, CTA | `min-h-11` | R6 |
| `index.tsx:172`, ack | `min-h-11` | R7 |
| `index.tsx:183`, esqueleto | `rounded-card` | R10 |
| `index.tsx:189`, reintento | `min-h-11` | R10 |

Por tanto, R3.7 seguirá rojo aunque el héroe cumpla R3.1–R3.6. Para ponerlo verde en ese paso habría que anticipar implementación y cambios de tests de R5–R10; eso incumple el orden y sus commits rojo/verde. Dejarlo rojo hasta el cierre también incumple el verde exigido para R3. E1 no enmienda esta dependencia.

Corrección propuesta para el leader, **no aplicada**: situar el test global R3.7 y la medida final M20 en el bloque de cierre R13, una vez implementados R5–R10, o aprobar expresamente otro reparto TDD que resuelva la dependencia.

### B2 — R7.2 prohíbe modificar aserciones incompatibles con R7.1 y R3

- `requirements.md` R7.2 (líneas 304–307) dice: «los it de #100 R5 (~308), #134 R2 (~380), #170 R6 (~434) y R8–R14 no se tocan y siguen en verde».
- El `it` de #100 R5 «marca leída una vez y retira el botón» contiene en `index.test.tsx:318`:
  `expect(button.props.className).toContain('min-h-11');`.
- R7.1 enmendado por E1 exige la clase **exacta** `w-full h-14 rounded-16 bg-accent border-b-4 border-black/25`, sin `min-h-11`; R3.7 también prohíbe ese literal en producción.
- Además, el describe #170 R6 (`index.test.tsx:434–457`) exige los bordes antiguos y sus clases exactas, mientras el paso R3 exige expresamente reescribirlo para el héroe sin borde.

No pueden conservarse esas aserciones intactas y obtener verde con el aspecto aprobado.

Corrección propuesta para el leader, **no aplicada**: precisar en R7.2 que se conservan las aserciones de comportamiento del ack, permitiendo enmendar las aserciones visuales correspondientes a R3 y R7 y sus títulos, según el resto de la spec.

## Commits rojo / verde y trazabilidad

- Ningún commit TDD: se detuvo la sesión antes de implementar R1. R1–R13 pendientes; R14 corresponde al humo humano.
- `traceability.md` permanece intacto: no existen hashes de implementación que registrar.
- Único cambio persistente: este informe de H0 y bloqueos, en un commit documental propio. No incluye archivos de arnés en commits TDD.
- No se ejecutaron tsc/lint tras verdes porque no hay ningún verde ni cambios de código.
- No se ejecutó `init.sh`, la suite móvil completa, ni las sondas de mutación posteriores a R12: no se ha alcanzado esa fase.
- No se marcaron casillas, no se cambió el estado de la feature y no se abrió ni editó la PR.
- Sin cambios en `package.json`, `bun.lock`, `progress/current.md`, `progress/history.md` o `STATUS.md`.

## Medidas al detenerse

La implementación no ha cambiado. Se repitieron las 25 medidas: todas conservan la base H0; los deltas de aceptación todavía no se han aplicado.

| Medida | Base H0 | Al detenerse | Delta observado |
|---|---:|---:|---:|
| M1 | 7 | 7 | 0 |
| M2 | 1 | 1 | 0 |
| M3 | 0 | 0 | 0 |
| M4 | 10 | 10 | 0 |
| M5 | 3 | 3 | 0 |
| M6 | 1 | 1 | 0 |
| M7 | 4 | 4 | 0 |
| M8 | 11 | 11 | 0 |
| M9 | 1 | 1 | 0 |
| M10 | 5 | 5 | 0 |
| M11 | 9 | 9 | 0 |
| M12 | 6 | 6 | 0 |
| M13 | 2 | 2 | 0 |
| M14 | 13 | 13 | 0 |
| M15 | 12 | 12 | 0 |
| M16 | 14 | 14 | 0 |
| M17 | 34 | 34 | 0 |
| M18 | 1 | 1 | 0 |
| M19 | 2 | 2 | 0 |
| M20 | 11 | 11 | 0 |
| M21 | 3 | 3 | 0 |
| M22 | 1 | 1 | 0 |
| M23 | 0 | 0 | 0 |
| M24 | 0 | 0 | 0 |
| M25 | 1 | 1 | 0 |

## Reanudación tras E2 — 2026-10-18

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-180`.
- Rama: `feature/180-mobile-alert-detail-canvas-fidelity`.
- H0: `978f7044` (HEAD al reanudar). Firma E2: `e0386f87`, verificada en el log y casilla marcada.
- `fetch` y `merge origin/main`: Already up to date.
- P1–P14: conformes. M1–M25 repetidas sin diferencias frente al informe BLOQUEADO.
- Skills de la sesión: `ponytail:ponytail`, `building-native-ui`, `expo-tailwind-setup`, `appllama-app-design-skill`, `animate-expo`.
- B1 y B2 resueltos por E2.1–E2.8. Se conserva íntegro el informe anterior.

| Medida | H0 de reanudación |
|---|---:|
| M1 | 7 |
| M2 | 1 |
| M3 | 0 |
| M4 | 10 |
| M5 | 3 |
| M6 | 1 |
| M7 | 4 |
| M8 | 11 |
| M9 | 1 |
| M10 | 5 |
| M11 | 9 |
| M12 | 6 |
| M13 | 2 |
| M14 | 13 |
| M15 | 12 |
| M16 | 14 |
| M17 | 34 |
| M18 | 1 |
| M19 | 2 |
| M20 | 11 |
| M21 | 3 |
| M22 | 1 |
| M23 | 0 |
| M24 | 0 |
| M25 | 1 |

H0 repetido completo: quince anclas y literales sin cambios; 4 suites de ruta verdes antes y después de la sonda BlurView; Card real, BlurView real y ping a 0/900/1900 verdes. Sin dobles adicionales ni fallback. Orden de MOTION_ALERT_PING_MS primero confirmado.

R1 rojo: tres tests de título y candados fallan por las diferencias esperadas. La suite de pantalla acabó sus aserciones pero retuvo handles; se terminó su proceso después del resumen. En las siguientes ejecuciones se usa `--forceExit` además de `--testTimeout=30000` para evitar esa espera preexistente; sin modificar aserciones ni timeouts.

### Resultado de la reanudación: R1 verde; BLOQUEADO antes de R8

| Requisito | Rojo | Verde | Verificación |
|---|---|---|---|
| R1.1–R1.3 | `b07bc024` — test(mobile): #180 R1 rojo — título del detalle en el contenido | `e37300ec` — feat(mobile): #180 R1 título del detalle en el contenido (D-H) | 5 suites, 195 tests; tsc y lint verdes |

R1 conserva la cabecera nativa y cambia solo su título a vacío. El título localizado se pinta antes del resto del contenido en carga, error y contenido. Se actualizaron el inventario de copy y los consumidores de text-26/tracking-title. El test de orden consulta el View de contenido que React Native inserta dentro del ScrollView; comprueba su primer elemento, no el envoltorio nativo.

Suites de R1: pantalla 85/85; layout 27/27; ui-language 30/30; profile-canvas-fidelity 26/26; alerts-canvas-fidelity 27/27. Se ejecutaron secuencialmente y con ambos pgrep vacíos antes de cada Jest. `test ! -e .expo/types/router.d.ts` pasó; `bunx tsc --noEmit` y `bunx expo lint --no-cache` terminaron con código 0; el log de lint no contiene `Failed to run` y no emite diagnósticos.

#### B3 — R8 registra una ocurrencia de copy que no existe hasta R5.4

Dependencia localizada al preparar el siguiente paso, sin modificar aún tests ni implementación de R8:

- `tasks.md`, bloque R8 rojo: exige añadir la fila de `alerts.mapLabel` a `R13_ALERT_DETAIL` (`ui-copy-table.ts`, K3), e incrementar la longitud esperada en `ui-language.test.ts` (K2).
- El verde de R8 solo añade el catálogo y su fila documental. La pantalla recibe la etiqueta accesible en **R5.4**, después de R11, R3 y R4.
- `src/__tests__/ui-language.test.ts:42–68`, `checkUses`: cada fila del inventario exige exactamente una llamada textual `t('<clave>')` o un campo `labelKey: '<clave>'` en el fichero registrado.
- El test «registra cada ocurrencia del detalle» llama `checkUses(R13_ALERT_DETAIL)` (línea 255); el candado global también lo comprueba mediante `ALL_USES` (línea 492).
- En la pantalla después de R1, el mismo cálculo del candado devuelve:

```text
file: src/screens/alert-detail/index.tsx
key: alerts.mapLabel
uses: 0
expected tras añadir la fila de R8: 1
```

Añadir traducciones y documentación en R8 no modifica ese resultado: `ui-language` seguiría rojo después de su verde. Es la misma dependencia temporal que E2.1 resolvió para R3.7, pero E2 no reasigna el registro de copy ni el consumidor de `alerts.mapLabel`.

No se adelanta implementación de R5.4, no se añade una llamada ficticia/comentada a `t`, no se deja un candado rojo y no se debilita `checkUses`.

Corrección propuesta para el leader, **no aplicada**: mantener catálogo/LP/documentación en R8 y mover el registro de `alerts.mapLabel` de `ui-copy-table.ts` y la longitud de UL al rojo de R5, donde se implementa su uso en R5.4. Otra opción requiere autorizar expresamente implementar y probar R5.4 en R8.

Se aplica la instrucción del handoff «Si algo no cuadra con la spec, PARA y reporta antes de improvisar». R1 queda revisable en sus dos commits; R8–R13 no se han empezado. No se modifica la spec ni su trazabilidad: el único commit final de traceability con hashes queda reservado para el cierre de la implementación.

### Medidas al detener la reanudación

| Medida | H0 reanudación | Al detenerse | Delta observado |
|---|---:|---:|---:|
| M1 | 7 | 8 | +1 |
| M2 | 1 | 0 | -1 |
| M3 | 0 | 1 | +1 |
| M4 | 10 | 10 | +0 |
| M5 | 3 | 3 | +0 |
| M6 | 1 | 1 | +0 |
| M7 | 4 | 5 | +1 |
| M8 | 11 | 11 | +0 |
| M9 | 1 | 1 | +0 |
| M10 | 5 | 5 | +0 |
| M11 | 9 | 9 | +0 |
| M12 | 6 | 7 | +1 |
| M13 | 2 | 2 | +0 |
| M14 | 13 | 13 | +0 |
| M15 | 12 | 12 | +0 |
| M16 | 14 | 14 | +0 |
| M17 | 34 | 34 | +0 |
| M18 | 1 | 1 | +0 |
| M19 | 2 | 2 | +0 |
| M20 | 11 | 11 | +0 |
| M21 | 3 | 3 | +0 |
| M22 | 1 | 1 | +0 |
| M23 | 0 | 0 | +0 |
| M24 | 0 | 0 | +0 |
| M25 | 1 | 1 | +0 |

Deltas propios de R1: M1 +1, M2 -1, M3 +1, M7 +1 y M12 +1; resto sin cambios. No se ha ejecutado init.sh, no se han modificado dependencias ni archivos reservados al leader, no hay temporales en el worktree, no se ha abierto/editado PR y no se ha marcado el humo humano. No se declara terminada la feature.
