# Implementación — #244 R10 (C4 y C5)

Fecha: 2026-11-06. Alcance: solo el test R10, la enmienda de la carta y el cierre
autorizado en `progress/handoff_mobile-orbit-splash-icono-r10.md`.

## Base y anclas T0

Ruta y rama confirmadas:

```text
/home/claude/sites/Pet-Tracker-wt-244b
feature/244-r10-enmienda-carta
```

Salida literal de las anclas, en el orden del handoff:

```text
5a93bb39d077c0af3e34998522af2a8948aea3a8
0
1
con-node-modules
sin-router-d-ts
```

HEAD es el commit del handoff, posterior a H0
`f201b9dfbf99c13c757f39bc28a95da875902927`; comprobada la ascendencia con
`git merge-base --is-ancestor` (exit 0). G4 está marcada en requirements.md.
El árbol estaba limpio al comenzar.

Las cuentas T0 corresponden, respectivamente, a los encabezados de las enmiendas
244 y 243. El primer `grep -c` dio 0 y exit 1, como se esperaba.

## C4: rojo antes de documentación

Commit `2a53b995ab2eeb546107b4038b4af1d68bf0ae0b`:
`test(mobile): R10 red, charter amendment for the brand assets (#244)`.

Solo añade el `it` de R10 de design.md §3.1 al fichero existente. Los valores
esperados son literales, sin imports de producción. Comprueba la cuenta exacta
del encabezado, los siete literales de la sección, la casilla tolerante a firma
y los encabezados posteriores.

Antes de cada invocación de Jest, ambos comandos dieron salida vacía (exit 1,
ningún proceso concurrente):

```bash
pgrep -af '[n]ode_modules/(.bin/jest|jest-worker)'
pgrep -af '[i]nit.sh'
```

Desde `mobile-pet-tracker/`:

```bash
bunx jest src/__tests__/orbit-brand-assets.test.ts --testTimeout=30000
```

Exit 1. Extracto literal del rojo, con la carta todavía intacta:

```text
Expected: 1
Received: 0

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
Snapshots:   0 total
```

Falló en la aserción de la cuenta del encabezado (línea 123), sin errores de
import ni helpers inexistentes. Se commiteó C4 antes de editar la carta.

## C5: literal de la enmienda y verde

Commit `1cdf6c63c53bfd6e41795f213d91dcf83144189b`:
`docs(ui): R10 charter amendment, the icon and splash are Orbit (#244)`.

Solo añade al final de `docs/ui-guidelines.md`, tras una línea en blanco, el
literal exacto de design.md §5 con `Fecha: 2026-11-06` y la casilla
`- [ ] Enmienda #244 aprobada por humano` desmarcada. Se comparó el fichero
completo con su versión anterior más el literal extraído de la spec: coincide
exactamente. El punto 7 y la Enmienda #243 conservan sus bytes anteriores.
La firma efectiva de G4 permanece en requirements.md, sin editarlo.

Cada suite se corrió por separado y en secuencia, desde `mobile-pet-tracker/`,
con `bunx jest <ruta> --testTimeout=30000` y las guardas de procesos vacías
antes de cada ejecución:

| Ruta | Suites verdes | Tests verdes | Exit |
|---|---:|---:|---:|
| `src/__tests__/orbit-brand-assets.test.ts` | 1 | 22 | 0 |
| `src/__tests__/orbit-cachorro-art.test.ts` | 1 | 35 | 0 |
| `src/__tests__/orbit-charter-voice.test.ts` | 1 | 1 | 0 |
| `src/__tests__/home-photo-hero-canvas.test.ts` | 1 | 28 | 0 |
| `src/__tests__/orbit-rename.test.ts` | 1 | 7 | 0 |
| `src/__tests__/design-drift.test.ts` | 1 | 127 | 0 |
| **Total** | **6** | **220** | **0** |

Ningún test omitido. Refactor: ninguno.

Antes de typecheck, `test ! -e .expo/types/router.d.ts` pasó (exit 0).
No se borró ni generó ese fichero. Comandos exactos desde `mobile-pet-tracker/`:

```bash
bun run typecheck > /tmp/typecheck-244b.log 2>&1; echo "exit=$?"
bunx expo lint --no-cache > ../progress/lint-244b.log 2>&1 && test ! -s ../progress/lint-244b.log; echo "exit=$?"
```

Salida de cada comando: `exit=0`. El log de tipos solo contiene
`$ tsc --noEmit`; el de lint está vacío (0 bytes) e ignorado por Git.
No se ejecutó Prettier ni la invocación rota de lint.

## Guardas tras C5

Comandos exactos desde la raíz, con H0 del handoff:

```bash
grep -c '^## Enmienda #244 — ' docs/ui-guidelines.md
awk '/^## Enmienda #244 — /{f=1} f' docs/ui-guidelines.md | grep -c 'Pingo'
git diff --name-only f201b9dfbf99c13c757f39bc28a95da875902927..HEAD -- . ':!specs' ':!progress'
```

Salida literal, en ese orden:

```text
1
0
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/orbit-brand-assets.test.ts
```

El segundo `grep -c` sale con exit 1 al imprimir 0, como exige la guarda.
Ninguna ruta adicional fuera de specs y progress cambió contra H0.

## Mutación M18 sobre el verde

Se duplicó temporalmente al final de la carta el encabezado
`## Enmienda #244 — El icono y el splash son de Orbit`; la cuenta pasó a 2.
Con las guardas de procesos vacías, se ejecutó otra vez el fichero entero:

```bash
bunx jest src/__tests__/orbit-brand-assets.test.ts --testTimeout=30000
```

Exit 1. Extracto literal:

```text
Expected: 1
Received: 2

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
Snapshots:   0 total
```

La aserción de R10 detectó la duplicación (línea 123). Restauración exacta:

```bash
git checkout HEAD -- docs/ui-guidelines.md
git diff --exit-code HEAD -- docs/ui-guidelines.md
```

Diff vacío; el encabezado volvió a contarse una vez. Después de restaurar,
la misma suite pasó con exit 0 y 22/22 tests verdes. No se commiteó la mutación.

## Cierre del tramo

- Solo se actualiza la fila R10 de `traceability.md`, con los hashes completos de
  C4 y C5, en el commit separado `docs(spec)` que contiene también este reporte.
- No se modifica ningún otro fichero versionado fuera de las cuatro rutas
  autorizadas. No se tocan assets, las casillas de requirements.md, el reporte de
  C1 a C3, feature_list.json, current/history ni STATUS.md.
- El estado global de la feature sigue como estaba: G3 y G2 son del humano.
  La suite completa y `./init.sh` corresponden al leader; aquí se verifican las
  seis suites exigidas por este handoff, tipos, lint y la mutación M18.
- El marcador final ignorado `progress/impl_mobile-orbit-splash-icono-r10.done`
  contiene una sola línea con la ruta absoluta de este reporte y se crea como
  última acción, después de commitear y comprobar el cierre.

## Skills y desviaciones

- Ninguna skill aplicada: este tramo no toca UI ni pantallas. Se leyó por error
  `ponytail/SKILL.md` al inicio, antes de procesar la prohibición del handoff;
  no se aplicó ni se cargaron skills adicionales.
- El primer comando se ejecutó ya en el worktree correcto como
  `pwd && git status --short && git branch --show-current`, sin el `cd` explícito
  solicitado. Dio la ruta y rama esperadas, con estado limpio. Después se repitió
  el comando exacto del handoff y se confirmó la misma salida.
- Se consultó la documentación exacta de Expo SDK 57
  (<https://docs.expo.dev/versions/v57.0.0/>) antes de escribir el test, como exige
  `mobile-pet-tracker/AGENTS.md`.
- Una comprobación adicional de las cuatro rutas de esta sesión falló por usar
  H0 como base incluyendo progress: entre H0 y el HEAD inicial ya existía el
  commit del handoff, que añade `progress/handoff_mobile-orbit-splash-icono-r10.md`.
  Se comprobó esa diferencia por separado y se corrigió la base de esta
  comprobación adicional al HEAD inicial `5a93bb39d077c0af3e34998522af2a8948aea3a8`.
  Contra él cambian exactamente las cuatro rutas autorizadas. Las tres guardas
  originales del handoff conservan H0 y dan las salidas esperadas.
- No se ejecuta `./init.sh`: lo reserva el handoff al leader por la infraestructura
  compartida. No se hace merge, rebase, push ni creación o edición de PR.
