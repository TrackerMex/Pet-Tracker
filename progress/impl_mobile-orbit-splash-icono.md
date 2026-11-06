# Implementación mobile-orbit-splash-icono — tanda C1a, C1b, C2

Fecha: 2026-11-06. **Bloqueada por la guarda de lint**; alcance R1–R9 y R11.
C1a y C1b commiteados; C2 aplicado y verificado parcialmente, sin commit.
No se hicieron C4 ni C5.

Ruta confirmada: `/home/claude/sites/Pet-Tracker-wt-244`.
Branch confirmada: `feature/244-orbit-splash-icono`.
H0: `a1e8acb1b1001d8bbfacb0a48096f8e8d09a7c89`.
Handoff: `9f0e167d`.

## Anclas T0

Salida de los comandos literales del handoff, antes del primer test:

```text
a1e8acb1b1001d8bbfacb0a48096f8e8d09a7c89
3
397688b0222b
ad655780a53b
sin-router-d-ts
con-node-modules
13.0.0
```

Las tres fuentes y el script coinciden también por sha256 completo con requirements.md.
uv: `uv 0.12.9 (x86_64-unknown-linux-gnu)`. Pillow: `13.0.0`.

## Desviaciones de arranque

- El primer comando fue `pwd`, estado de git y lectura del handoff y de la skill ponytail;
  después se ejecutó el comando literal de ruta y branch, con las salidas correctas
  anteriores. No se había modificado ningún fichero.
- Skills cargadas: solo `ponytail`, leída antes de conocer la prohibición del handoff.
  No se cargaron skills de Expo ni de `.agents/skills/`: la tarea solo toca assets y tests.
- Una lectura exploratoria intentó abrir `mobile-pet-tracker/jest.config.js`, que no
  existe. La configuración está en `package.json`, ya leído. No fue una ejecución
  de Jest ni se tocaron ficheros por esa lectura.
- Se consultó https://docs.expo.dev/versions/v57.0.0/ por la instrucción local de
  `mobile-pet-tracker/AGENTS.md`. No se instalaron paquetes.

No se ejecutó `./init.sh`, no se regeneraron `.env` ni `node_modules`, ni se modificaron
casillas, estados globales o documentación de UI. Sin push, PR, merge ni rebase.

## TDD

C1a: `bunx jest src/__tests__/orbit-brand-assets.test.ts --testTimeout=30000`,
exit 1, 16 fallos por aserción y 5 verdes (21 total); sin errores de import ni ENOENT.
Commit: `91b91fd7` — `test(mobile): R1 R2 R3 R8 red, Orbit brand art locked by content (#244)`.
Log local ignorado: `progress/244-c1a.log`.
Nacieron verdes R1 logo-glow, R3 fuentes (tres filas) y R3 script.

C1b: `bunx jest app.assets.test.ts --testTimeout=30000`, exit 1,
2 fallos por aserción y 18 verdes (20 total). R5 splash recibió 25 píxeles fuera del
círculo y R5 foreground recibió 98060, las cifras exactas de la spec. Los tests
existentes restantes pasaron. Commit: `1abb6782` —
`test(mobile): R5 R6 R7 red, safe circle and brand pixels (#244)`.
Log local ignorado: `progress/244-c1b.log`.
Nacieron verdes R5 monocromo, R6 (dos filas) y R7 (cinco filas).

## Conversión C2

Temporal primero: el comando literal de design.md §2 produjo ocho filas `ok`,
exit 0; se compararon los ocho hashes, bytes, cajas, radios y alfas mínimos con
requirements.md antes de ejecutar sin argumento. La corrida sobre el repositorio
produjo la misma salida, también exit 0. Salida de ambas:

```text
fichero size modo bytes sha256 bbox(l,t,r,b) radio alfaMin>0
icon.png (1024, 1024) RGBA 586918 e393931e24bcd95bd695c3b34f0ed25ab0b16d56363cbd7ed50b70510ed58248 (0, 0, 1024, 1024) 723.4 255 ok
android-icon-foreground.png (1024, 1024) RGBA 384993 6b4d36aa533c64535d7a165b7864aabaf3182c79bfb2155b6d88420839772828 (183, 233, 841, 792) 329.1 16 ok
android-icon-monochrome.png (1024, 1024) RGBA 29443 472bbcc7cd8337a04fae481f5c17bcc8a375f436941cc76bdd18cdce44b13fa1 (183, 233, 841, 792) 329.1 16 ok
splash-icon.png (1024, 1024) RGBA 410234 b2b69eb940cc6e000fdda432479d6aeb6004e7ffd78718e532a37d89544dc6d5 (216, 190, 815, 826) 335.2 16 ok
favicon.png (48, 48) RGBA 3539 d3ff4cf57f6200a8217bd424ca740e7b13e4714b4428bcf60db70e330450a976 (0, 0, 48, 48) 33.2 255 ok
pet-tracker-notification-96.png (96, 96) RGBA 4687 6639fc98b1d9fd02df99a5ed77c37cfbdd69b327d145a55a68996ee169c7174e (4, 10, 92, 85) 45.0 1 ok
pet-tracker-notification-color-96.png (96, 96) RGBA 12946 e3bc99a9567b0b43c93dcfe7c60b5080b8c50e397ca2c2360a949dbfd4f63c3b (4, 10, 92, 85) 45.0 1 ok
orbit.png (1024, 1024) RGBA 384993 6b4d36aa533c64535d7a165b7864aabaf3182c79bfb2155b6d88420839772828 (183, 233, 841, 792) 329.1 16 ok
exit=0
```

Los sha256 medidos sobre los ocho PNG del repositorio coinciden con esas ocho filas.
Se retiraron los cinco ficheros mediante `git rm` individual y se escribió el JSON
literal de design.md §4. No se modificó el script ni sus fuentes.

## Verde y bloqueo

Ejecutado desde `mobile-pet-tracker/`, con ambas búsquedas `pgrep` del handoff vacías
antes de Jest:

```text
$ bunx jest src/__tests__/orbit-brand-assets.test.ts app.assets.test.ts --testTimeout=30000
PASS src/__tests__/orbit-brand-assets.test.ts
PASS ./app.assets.test.ts (31.561 s)

Test Suites: 2 passed, 2 total
Tests:       41 passed, 41 total
Snapshots:   0 total
Time:        32.044 s
exit=0
```

Log local ignorado: `progress/244-c2.log`.

Antes de tipos se confirmó que no existe `.expo/types/router.d.ts`:

```text
$ test ! -e .expo/types/router.d.ts && bun run typecheck > /tmp/typecheck-244.log 2>&1; echo "exit=$?"
exit=0
$ cat /tmp/typecheck-244.log
$ tsc --noEmit
```

La guarda literal de lint falló:

```text
$ bun run lint > /tmp/lint-244.log 2>&1 && test ! -s /tmp/lint-244.log; echo "exit=$?"
exit=1
$ cat /tmp/lint-244.log
$ expo lint
$ wc -c /tmp/lint-244.log
12 /tmp/lint-244.log
```

El único contenido es la línea que imprime Bun al invocar el script; no hay
diagnósticos de ESLint. Aun así, `test ! -s` exige un log vacío y la guarda es roja.
Se detuvo el trabajo por la regla explícita del handoff («Solo PARA si falla el
código, una cifra de esta lista o una guarda»). No se alteró la invocación, el log,
el criterio ni package.json para hacerla pasar. El leader debe resolver este contrato
antes de reanudar C2.

No se creó el commit C2 que se titularía `feat(mobile): R1 R2 R5 R8 green, Orbit replaces
the robot in the brand assets (#244)`: no se presenta como verde una guarda fallida.

## Comprobaciones pendientes

- Mutaciones plantadas: **ninguna**; la parada fue anterior a la campaña sobre el
  verde final. Pendientes M4, M5, M6, M7, M8, M12, M13 y M15 para los casos que nacieron
  verdes, ya enumerados en TDD. M2/M3 tampoco se plantaron; sus zonas ciegas siguen
  cubiertas en el estado actual únicamente por el pin de R1 y la lectura del script.
- No se ejecutó el refactor ni el resto de §Verde de la cadena: `app.config.test.ts`,
  las seis suites de Orbit/diseño y las dos de arranque/bienvenida quedan pendientes.
- No se ejecutaron las guardas finales contra `H0..HEAD`: requieren el commit C2,
  que la guarda de lint impide crear. No se declara cumplido R9 ni R11.
- R10 sigue fuera de alcance y G4 sin tocar. No se hizo C4 ni C5, no se añadió su `it`
  ni se editó `docs/ui-guidelines.md`. Tampoco se ejecutó ninguna guarda de «tras C5».
- La suite completa con `./init.sh` corresponde al leader; G3/rebuild y G2/smoke al
  humano. No se verificó el render de iOS.

## Estado entregado

Las fuentes y el script conservan los sha256 completos de requirements.md. No hubo
ninguna denegación del sandbox ni un fallo de uvx. No se siguieron instrucciones
procedentes de las fuentes congeladas.

El árbol móvil queda con C2 sin commit: los trece ficheros de assets de la superficie
autorizada y `scripts/make-icons.mjs` borrado. No se revierte trabajo autorizado ni se
mezcla con el commit de documentación. El índice se deja sin cambios de C2 para que
el commit de cierre incluya solo este reporte y la nota de trazabilidad.
El árbol no está limpio; es una limitación explícita de esta entrega bloqueada.

El marcador `.done` indica que terminó esta tanda y debe leerse este reporte;
**no indica feature completada**. Sin push ni PR. Sin merge ni rebase.
