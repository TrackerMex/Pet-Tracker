---
feature: "init-env-drift-warning"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[init-env-drift-warning]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
>
> **Esta feature no toca la aplicación.** Vive entera en el harness
> (`init.sh`, `init.config.sh`, dos archivos nuevos en la raíz y dos docs). No
> hay capa domain / application / infrastructure que respetar, ni migraciones,
> ni infraestructura AWS.

## Decisiones técnicas

Las seis decisiones que la spec tenía que cerrar por escrito, en orden. Codex
no participó en la conversación que originó esta spec: si algo aquí queda
abierto, se decide **parando y preguntando**, no improvisando.

### D1 — El warning SÍ destaca los gates `*_ENABLED` (R3)

**Decisión: sí, en dos listas separadas, gates primero.**

Las dos sesiones que esta feature existe para evitar las quemó un gate, no una
variable de configuración: `REMINDERS_ENABLED` en el smoke de #16 y
`POLLER_ENABLED` en el de #24 (con `ALERTS_ENGINE_ENABLED`,
`ACTIVITY_AGGREGATOR_ENABLED` y `PUSH_ENABLED` de acompañamiento). La asimetría
es real y no es de gusto:

| Clave ausente | Qué pasa | Cómo se manifiesta |
|---|---|---|
| `*_ENABLED` | El default en código es `false` ⇒ un worker entero **no se agenda** | Silencio absoluto: no hay error, no hay log, el sistema parece sano |
| Resto (`AWS_MODE`, `SIM_SEED`, `PORT`...) | Se usa un default razonable, o el proceso falla al arrancar | Visible: excepción, o comportamiento distinto pero observable |

El que necesita el ojo del humano es el primero. Coste de la distinción:
`key.endsWith('_ENABLED')`, una llamada. Lo barato aquí es hacerlo, no
discutirlo.

Regla **puramente sintáctica** por el sufijo, a propósito: nada de mantener una
lista blanca de gates conocidos, que sería otra lista que envejece — que es
exactamente el defecto de `REQUIRED_ENV_VARS` que estamos rodeando. Efecto
lateral aceptado: `EMAIL_ENABLED` y `PUSH_ENABLED` seleccionan un *sender* de
consola en vez de apagar un worker, y aun así salen en la lista de gates. Es
correcto: también cambian comportamiento en silencio.

El formato exacto (texto literal, orden, indentación, singular/plural) está
fijado en R3 y no queda a criterio del implementador. Las líneas van sin emoji
ni color porque las imprime `warn()` de `init.sh`, que ya pone los dos.

### D2 — Qué cuenta como "clave" (R1)

Una sola regla, **idéntica para los dos archivos**, aplicada sobre la línea ya
recortada: se ignora lo vacío y lo que empieza por `#`; lo demás aporta clave
si casa `/^([A-Za-z_][A-Za-z0-9_]*)\s*=/`. El valor no se mira nunca.

Las tres subdecisiones que producen falsos positivos si se eligen mal:

- **Clave comentada en `.env.example` ⇒ NO se espera.** Comentar una línea en
  el ejemplo es la forma de decir "esto es opcional / documentación". Si
  contara, cada bloque explicativo del archivo generaría avisos.
- **Clave comentada en `.env` ⇒ cuenta como AUSENTE.** Es literalmente cierto:
  el proceso no la verá. Y captura el mismo modo de fallo que la clave
  inexistente — alguien comentó `POLLER_ENABLED` para una prueba y no lo
  deshizo. **Caso benigno conocido y aceptado**: el procedimiento manual de
  #19/#20 (`docs/verification.md`) pide comentar `AWS_ENDPOINT_URL`,
  `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` para trabajar contra AWS real;
  mientras eso dure, `init.sh` avisará de esas tres. **No es un bug**: en ese
  estado el `.env` está efectivamente incompleto, y el aviso desaparece al
  restaurar las líneas como manda el propio procedimiento. Queda anotado aquí
  para que nadie lo reporte como regresión.
- **CRLF y BOM se eliminan antes de comparar.** `.env.example` está commiteado
  con CRLF (verificado con `file`), `.env` local es LF, y `.gitattributes` solo
  normaliza `*.sh`. Sin `split(/\r?\n/)` se compararía `KEY` contra `KEY\r` y
  **las 21 claves saldrían como faltantes**: el falso positivo total. El BOM
  cuesta un `replace` y lo ponen los editores de Windows.

`export KEY=v` no se reconoce: ningún archivo del repo lo usa y admitirlo es
código sin caso de uso.

### D3 — Dirección del diff: solo `.env.example` → `.env` (R2)

**Decisión: no se avisa de la deriva inversa.**

- El `.env` real tiene y debe tener extras locales: un `WIALON_TOKEN` de
  verdad, un override temporal, una variable de una rama en curso. Avisar de
  ellas sería ruido en cada `./init.sh`, y el ruido recurrente se aprende a
  ignorar — que es cómo mueren los warnings.
- Una variable retirada que sigue en `.env` es **inerte**: nadie la lee. No
  apaga nada, no enciende nada. Ningún incidente del proyecto la involucra.
- El modo de fallo que esta feature persigue —"una feature está apagada y no
  se nota"— solo lo produce la ausencia. La dirección inversa no lo produce
  nunca.

Es YAGNI con evidencia: cero incidentes en 24 features. Queda en §Fuera de
alcance de [[requirements]] por si alguien lo echa de menos.

### D4 — Dónde vive el bloque y qué pasa con `REQUIRED_ENV_VARS` (R7, R10)

**El bloque convive con `check_env()`; no lo sustituye ni lo envuelve.**

Ubicación exacta: §2 de `init.sh`, **después** del `fi` de la línea 74 y
**antes** del comentario `# ── 3. DEPENDENCIAS` de la línea 76. Es decir,
fuera del `if [ "${#REQUIRED_ENV_VARS[@]}" -eq 0 ]` que abre la línea 47, con
su propia guarda `[ -f .env ] && [ -f .env.example ]`.

Por qué fuera y no dentro: si mañana alguien vacía `REQUIRED_ENV_VARS`, el
chequeo de deriva —el útil— desaparecería con él. El diff no depende de esa
lista para nada; acoplarlos sería heredar su fragilidad.

Por qué `REQUIRED_ENV_VARS` **se queda tal cual** (`("DATABASE_URL")`):

1. Sigue teniendo un trabajo que el diff nuevo no hace: es la lista de "sin
   esto no arranca nada", y funciona **aunque `.env.example` no exista** — el
   único caso en que el diff calla (D6).
2. Es quien dispara el `cp .env.example .env` de las líneas 50-57, del que
   depende CI: el runner no tiene `.env` y lo crea ahí. Tocarlo es tocar el
   arranque de CI por una razón cosmética.
3. Sus líneas `✅ DATABASE_URL definida` son output existente que R9 protege.
   Borrarlas **cambiaría** el output con `.env` completo, incumpliendo un
   criterio de aceptación literal de la feature.

Se acepta la redundancia: `DATABASE_URL` la miran los dos chequeos. Añadir
lógica para deduplicar sería más código que el que ahorra.

Único cambio en `init.config.sh`: `TEST_CMD` gana
`&& node --test env-drift.test.mjs`. Sin eso los tests de R1-R11 no los ejecuta
nadie —ni `./init.sh` ni CI— y una suite que no corre no es una suite.

### D5 — Portabilidad: el diff lo hace node, no el shell (R7d, R10)

**Herramientas permitidas en el bloque de `init.sh`**: builtins de bash
(`[ -f ]`, `while IFS= read -r`, `$( )`, `<<<`), la función `warn()` que ya
existe, y `node`.

**Prohibidas**: `comm`, `diff`, `sort`, `awk`, `sed`, `grep -f`, `python`,
`jq`, `nc`, `lsof`. Las tres últimas por la razón que ya documenta
`port_open()` (`init.sh:21-27`): no están garantizadas en Git Bash ni en los
runners. Las primeras, porque un pipeline `grep | sort | comm` sobre un archivo
CRLF y otro LF es precisamente la trampa de D2, y `comm` además exige entradas
ordenadas: tres utilidades, tres oportunidades de comportarse distinto en
Windows.

`node` no es una dependencia nueva: es `REQUIRED_TOOLS[0]` en
`init.config.sh:8`, CI lo fija en 24 (`.github/workflows/ci.yml`) y `init.sh`
ya lo usa cinco veces para leer `feature_list.json` (líneas 115, 128, 149, 156,
248). Leer el archivo con `readFileSync` y partir por `/\r?\n/` hace el
problema de CRLF desaparecer en lugar de sortearlo.

Detalles cerrados para que no se improvisen:

- Archivo `.mjs` (ESM) porque la raíz del repo **no tiene `package.json`**; la
  extensión es lo que fija el sistema de módulos. Solo `node:fs`, cero
  dependencias npm.
- Test con `node --test`, el runner de la stdlib — sin jest, sin instalar nada.
  El jest del backend no serviría: su config (`rootDir: "src"`) no alcanza la
  raíz del repo.
- El comando **nombra el archivo**: `node --test env-drift.test.mjs`.
  `node --test .` y `node --test ./` fallan en Git Bash con `Could not find '.'`
  (verificado en node v24.16.0 el 2026-08-16). Pasar la ruta del archivo
  funciona en Windows y en Linux.
- Guarda "¿me han ejecutado o importado?": `import.meta.filename === process.argv[1]`
  (verificado: `true` al ejecutar, `false` al importar). **No** se usa
  `import.meta.main`: es más nuevo y en un node antiguo valdría `undefined`, es
  decir el chequeo se apagaría **en silencio** — el mismo defecto que esta
  feature combate.
- Rutas por defecto relativas al script (`new URL('./.env', import.meta.url)`),
  no al `cwd`, y sobreescribibles por argv (`node env-drift.mjs [envPath]
  [examplePath]`). Eso es lo que hace testeables R4, R5 y R6 con fixtures en
  un tmpdir en vez de con teoría.

### D6 — Si falta `.env.example` (o `.env`), el bloque calla (R5, R7)

Doble red, las dos silenciosas:

- En `init.sh`: `if [ -f .env ] && [ -f .env.example ]`. Sin los dos archivos
  no hay nada que comparar.
- En `env-drift.mjs`: la lectura va en `try/catch`; cualquier fallo ⇒ cero
  bytes en stdout, exit 0.

Por qué callar y no avisar: el caso "faltan los dos" **ya está cubierto** y con
más severidad — `init.sh:56` hace `fail ".env no encontrado y no existe .env.example"`.
El caso "hay `.env` pero no `.env.example`" es un repo roto, no un `.env` viejo:
es un problema de integridad del repositorio, y el sitio de esos chequeos es §4
(HARNESS), no §2. Añadirlo ahí es otra feature, y hoy nadie lo ha sufrido.

Lo que **no** se hace: `2>/dev/null` sobre la llamada a `node`. Si el script
revienta, el error se ve. El `|| true` absorbe el exit code y nada más.

## Archivos afectados

Ninguno de la aplicación. Todas las rutas son relativas a la raíz del repo.

| Archivo | Qué cambia | Requisitos |
|---|---|---|
| `env-drift.mjs` | **Nuevo.** ESM sin dependencias. Exporta `parseEnvKeys(text)`, `missingKeys(exampleText, envText)` y `formatDriftLines(missing)`; al final, CLI guardada por `import.meta.filename === process.argv[1]` que lee los dos archivos en `try/catch` e imprime una línea por elemento de `formatDriftLines()`. Solo `readFileSync` | R1-R6 |
| `env-drift.test.mjs` | **Nuevo.** Suite de `node --test` (`describe`/`it` de `node:test`, `node:assert/strict`). Fixtures en `mkdtempSync(join(tmpdir(), 'env-drift-'))`, CLI invocada con `execFileSync(process.execPath, ...)`, e inspección de fuente de `init.sh` / `init.config.sh` con `readFileSync` | R1-R11 |
| `init.sh` | Bloque nuevo de 9 líneas + comentario, entre la línea 74 y la 76 (§2). **Nada más se toca**: `check_env()`, el `cp .env.example .env` y las líneas 1-74 quedan igual | R7, R8, R9 |
| `init.config.sh` | Una línea: `TEST_CMD` termina con `&& node --test env-drift.test.mjs`. `REQUIRED_ENV_VARS` **sin tocar** | R10 |
| `docs/verification.md` | Bloque `### Feature 23 — init-env-drift-warning` al final de "Verificación por feature": el procedimiento de R12 y el `diff` de sección de R9(b) | R11a, R12 |
| `AGENTS.md` | Una fila en el mapa del §2 para `env-drift.mjs` | R11b |
| `docs/conventions.md` | **Sin cambios.** Esta feature no introduce ninguna variable de entorno, así que la tabla "Variables de entorno" no gana filas. Confirmado contra las 21 claves de `.env.example` | R11 |
| `.env.example` | **Sin cambios.** No se añade ninguna clave, y **no se normaliza su CRLF**: el parseo de R1 es inmune y tocar un archivo commiteado por una razón ajena a la feature ensucia el diff | R11 |

## Inventario de riesgo

Lo que puede romper esta feature, revisado antes de escribirla:

- **CI se vuelve ruidoso.** No: el runner no tiene `.env`, `init.sh` lo crea
  copiando `.env.example` (líneas 50-57), los conjuntos de claves quedan
  idénticos y por R4 la salida es vacía. CI no cambia ni una línea.
- **El bloque aborta con `set -e`.** Cubierto por `|| true` (R7c) y aseverado
  por el `it` de shell real de R8.
- **`<<<` no existe.** Es un here-string de bash, e `init.sh` declara
  `#!/usr/bin/env bash` (línea 1) y CI lo invoca como `bash ./init.sh`. El
  script ya usa una sustitución de proceso `< <(...)` en la línea 149, que es
  estrictamente menos portable.
- **`$(...)` come el salto final** — sí, y es lo que se quiere: el `while`
  recibe exactamente N líneas, sin una vacía de propina.
- **Un `.env` con CRLF** (editado en Notepad): el parseo lo tolera (R1). Nota
  aparte, fuera de alcance: en ese `.env`, `dotenv` cargaría valores con `\r`
  pegado (`POLLER_ENABLED=true\r`), lo que rompería comparaciones `=== 'true'`
  en la app. Esta feature **no** lo detecta (es deriva de valores, no de
  claves) y no se le pide que lo haga.
- **`node --test` imprime su propio resumen en `init.sh`.** Sí, en §6 (TESTS),
  no en §2. R9 acota el "output no cambia" a §2 justamente por esto.

## Alternativas descartadas

- **Todo en bash con `grep`/`sort`/`comm`** (dos o tres líneas, sin archivos
  nuevos). Es la opción más corta y fue la primera candidata. Se descarta por
  dos razones duras, no por gusto: (1) `docs/verification.md` §Disciplina TDD
  exige que **cada R-id tenga un test que lo nombre**, y no hay forma razonable
  de testear un fragmento incrustado en mitad de `init.sh` sin ejecutar
  `init.sh` entero —que builda y testea el backend, y desde `TEST_CMD` sería
  recursivo—; (2) es exactamente el pipeline que tropieza con el CRLF de
  `.env.example` (D2, D5). Un chequeo de dos líneas que no se puede probar y
  que puede reportar las 21 claves como faltantes no es la opción lazy: es la
  que vuelve en la siguiente sesión.
- **`node -e "..."` en línea dentro de `init.sh`**, al estilo de las líneas
  115-123. Ahorra los dos archivos nuevos, pero deja la lógica —parseo,
  agrupación, formato— sin ningún test posible. El patrón `node -e` del repo se
  usa para one-liners triviales (`console.log(f.length)`), no para un parser.
- **Extraer la lógica a una función bash sourceable** (`init-env-drift.sh`
  cargado con `source`) y testearla con un script bash. Da testabilidad, pero
  crea un mini-framework de test en shell que el proyecto no tiene, y no
  resuelve el CRLF.
- **Ampliar `REQUIRED_ENV_VARS` con las 21 claves.** Sustituye una lista
  desactualizada por otra lista desactualizada, que es literalmente el defecto
  que se está arreglando. `.env.example` ya es la fuente de verdad y sí se
  mantiene (regla dura de `AGENTS.md` §4: toda variable nueva entra ahí en el
  mismo commit).
- **Copiar automáticamente las claves faltantes a `.env`** (append de las
  líneas del ejemplo). Lo prohíbe el criterio de aceptación de
  `feature_list.json` y con razón: elegiría por el humano el valor de
  `WIALON_TOKEN`, `AWS_MODE` o `POLLER_ENABLED`, y un `.env` que se
  automodifica es un cuarto modo de fallo silencioso, no la cura de los tres
  anteriores.
- **Abortar (`fail`) cuando falte un gate.** Dejaría sin arrancar el proyecto a
  cualquiera con un `.env` viejo, incluido el humano en mitad de un debugging.
  Un aviso que se puede leer vale más que un portazo que se aprende a rodear.
- **Escribir el aviso en un archivo** (`progress/env-drift.md`) además de en
  stdout. Nadie lo abriría; el sitio donde se mira es la salida de `init.sh`.
- **Una variable de entorno para silenciar el chequeo** (`ENV_DRIFT_CHECK=off`).
  Un interruptor para apagar el detector de apagados silenciosos. No.
