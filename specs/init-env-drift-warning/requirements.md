---
feature: "init-env-drift-warning"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[init-env-drift-warning]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #23 (`description` + los 4 `acceptance_criteria`,
> incluida la nota de subida a P2 del 2026-08-14).
> Todas las rutas de esta spec son relativas a la **raíz del repositorio**
> (`init.sh` vive ahí, no en `backend-pet-tracker/`).
>
> Esta feature no toca código de la aplicación: solo el harness. No hay capas
> domain / application / infrastructure implicadas.

## Contexto — el fallo exacto

`init.sh` §2 (líneas 43-74) hace dos cosas con el entorno:

1. **Copia `.env.example` → `.env` solo si `.env` falta** (líneas 50-57). Un
   `.env` creado hace meses nunca se vuelve a tocar, así que no recibe ninguna
   de las claves que introdujeron las features posteriores.
2. **Comprueba `REQUIRED_ENV_VARS`** con `check_env()` (líneas 62-73). Esa
   lista vive en `init.config.sh:12` y hoy vale exactamente
   `("DATABASE_URL")` — una sola clave, contra las 21 de `.env.example`. La
   comprobación existe, pero mira una lista que nadie actualiza: no detecta la
   deriva.

Resultado: el `.env` del humano y `.env.example` divergen en silencio, y como
las variables ausentes toman su default en código (`false` para todos los
gates), features enteras arrancan apagadas sin un solo mensaje.

Coste real acumulado, dos sesiones:

- **Smoke de #16**: `REMINDERS_ENABLED` ausente ⇒ el dispatcher de
  recordatorios nunca se agendó. El smoke falló sin ningún error visible.
- **Smoke de #24 con hardware real**: al `.env` le faltaban **nueve** claves de
  `.env.example`, cuatro de ellas gates — `POLLER_ENABLED` (la ingesta GPS
  entera: el collar transmitía y el cron nunca se agendaba),
  `ALERTS_ENGINE_ENABLED`, `ACTIVITY_AGGREGATOR_ENABLED` y `PUSH_ENABLED`.

Estado medido el **2026-08-16** en esta máquina, antes de implementar nada
(`.env.example` = 21 claves, `.env` = 13):

| Faltantes (8) | ¿Gate? |
|---|---|
| `ACTIVITY_AGGREGATOR_ENABLED` | sí |
| `ALERTS_ENGINE_ENABLED` | sí |
| `EMAIL_ENABLED` | sí |
| `PUSH_ENABLED` | sí |
| `AWS_MODE` | no |
| `SIM_HOME_LAT` | no |
| `SIM_HOME_LNG` | no |
| `SIM_SEED` | no |

Claves presentes en `.env` y ausentes en `.env.example`: **ninguna**.
Este inventario es el caso de aceptación manual de R12.

Dos trampas de entorno que la implementación tiene que sortear:

- **`.env.example` está commiteado con CRLF** (verificado con `file`:
  `CRLF line terminators`; `.gitattributes` solo normaliza `*.sh` a LF).
  `.env` local es LF. Cualquier diff textual ingenuo compara `KEY` contra
  `KEY\r`.
- **`init.sh` corre en Git Bash (Windows) y en el runner de CI**
  (`.github/workflows/ci.yml`: `bash ./init.sh`, `ubuntu-latest`, node 24).
  El repo ya evita `nc`/`lsof` por esta razón — ver el comentario de
  `port_open()` (`init.sh:21-27`).

---

## Requisitos funcionales

### Bloque A — El diff de claves (`env-drift.mjs`)

- **R1**: WHEN `parseEnvKeys(text)` (`env-drift.mjs`) recibe el contenido de un
  archivo de entorno THEN THE SYSTEM SHALL devolver la lista de claves
  aplicando **exactamente** estas reglas, idénticas para `.env` y para
  `.env.example`:

  1. El texto SHALL dividirse con `text.replace(/^\uFEFF/, '').split(/\r?\n/)`
     — el BOM inicial y los CRLF se eliminan antes de parsear.
  2. De cada línea SHALL tomarse su versión recortada (`line.trim()`).
  3. Una línea vacía o solo con espacios SHALL ignorarse.
  4. Una línea cuyo primer carácter (ya recortada) sea `#` SHALL ignorarse —
     **en los dos archivos**. Consecuencia deliberada: una clave comentada en
     `.env.example` NO se considera esperada, y una clave comentada en `.env`
     cuenta como **ausente** (está comentada, luego el proceso no la verá).
  5. Del resto, SHALL considerarse clave el grupo 1 de
     `/^([A-Za-z_][A-Za-z0-9_]*)\s*=/`. Se admiten espacios entre el nombre y
     el `=` (`KEY = valor` ⇒ `KEY`). Una línea sin `=` no es clave. El prefijo
     `export ` NO se reconoce (ningún archivo del repo lo usa).
  6. El valor a la derecha del `=` SHALL ignorarse por completo — este diff es
     de claves, nunca de valores.
  7. Las claves repetidas SHALL colapsarse a una sola ocurrencia.

  - Test: `env-drift.test.mjs`, describe
    `R1 (init-env-drift-warning #23): parseEnvKeys aplica las reglas de parseo`,
    con `it` para: (a) un texto con CRLF y otro idéntico con LF devuelven el
    mismo array; (b) `# COMENTADA=1`, `   # CON_ESPACIOS=1` y una línea en
    blanco no aportan claves; (c) `KEY = valor` y ` KEY2=v` dan `['KEY','KEY2']`;
    (d) `SIN_IGUAL` y `export KEY3=v` no aportan claves; (e) un texto con BOM
    (`'\uFEFFA=1'`) da `['A']`; (f) `A=1\nA=2` da `['A']`.

- **R2**: WHEN `missingKeys(exampleText, envText)` (`env-drift.mjs`) recibe el
  contenido de los dos archivos THEN THE SYSTEM SHALL devolver, **ordenadas
  ascendentemente** con `Array.prototype.sort()` por defecto y sin duplicados,
  las claves presentes en `exampleText` y ausentes en `envText`. THE SYSTEM
  SHALL NOT reportar la deriva inversa: una clave presente en `.env` y ausente
  en `.env.example` NO aparece en el resultado ni produce salida alguna
  (justificación en [[design]] §D3; queda listada en §Fuera de alcance).

  - Test: mismo archivo, describe
    `R2 (init-env-drift-warning #23): missingKeys solo reporta example → env`,
    con tres `it`: (a) example `A,B,C` / env `B` ⇒ `['A','C']` (orden
    alfabético, comprobado con `deepEqual`); (b) example `A` / env `A,SOLO_MIA`
    ⇒ `[]` — la deriva inversa se ignora; (c) example vacío ⇒ `[]`.

- **R3**: WHEN `formatDriftLines(missing)` (`env-drift.mjs`) recibe una lista
  **no vacía** de `n` claves faltantes THEN THE SYSTEM SHALL devolver un array
  de strings con este contenido literal, en este orden, omitiendo la línea de
  gates si no hay ninguno y la de configuración si no hay ninguna:

  ```text
  .env desactualizado: falta 1 clave de .env.example          (solo si n === 1)
  .env desactualizado: faltan ${n} claves de .env.example     (solo si n > 1)
    gates ausentes (apagan features enteras en silencio): ${gates.join(', ')}
    configuración ausente: ${config.join(', ')}
    init.sh no modifica .env — añade a mano las que necesites desde .env.example
  ```

  Reglas exactas de esas líneas:

  - **(a)** `gates` SHALL ser las claves de `missing` que cumplen
    `key.endsWith('_ENABLED')`; `config` SHALL ser el resto. Las dos listas
    SHALL conservar el orden alfabético que trae `missing` (R2) y SHALL unirse
    con `', '` (coma + un espacio).
  - **(b)** Los gates SHALL imprimirse **antes** que la configuración: son los
    que producen los apagados silenciosos que costaron #16 y #24.
  - **(c)** Las tres líneas de detalle SHALL empezar con **dos espacios** de
    indentación, igual que las de `check_env()` (`init.sh:65,67`).
  - **(d)** Las líneas SHALL NOT contener emoji, códigos de color ANSI ni salto
    de línea: el emoji y el amarillo los pone `warn()` de `init.sh` (R7).
  - **(e)** La última línea SHALL emitirse siempre que haya deriva, aunque solo
    falte una clave.

  Con el inventario del §Contexto la salida es exactamente:

  ```text
  .env desactualizado: faltan 8 claves de .env.example
    gates ausentes (apagan features enteras en silencio): ACTIVITY_AGGREGATOR_ENABLED, ALERTS_ENGINE_ENABLED, EMAIL_ENABLED, PUSH_ENABLED
    configuración ausente: AWS_MODE, SIM_HOME_LAT, SIM_HOME_LNG, SIM_SEED
    init.sh no modifica .env — añade a mano las que necesites desde .env.example
  ```

  - Test: mismo archivo, describe
    `R3 (init-env-drift-warning #23): formatDriftLines separa gates de
    configuración`, con cuatro `it` que comparan el array completo con
    `deepEqual`: (a) el inventario de 8 claves del §Contexto ⇒ las 4 líneas
    literales de arriba; (b) solo gates ⇒ 3 líneas, sin la de configuración;
    (c) solo configuración ⇒ 3 líneas, sin la de gates; (d) una sola clave ⇒
    cabecera en singular `falta 1 clave de .env.example`.

- **R4**: WHILE los dos archivos tengan el mismo conjunto de claves (o `.env`
  las tenga todas), THE SYSTEM SHALL producir salida vacía: `missingKeys()`
  SHALL devolver `[]`, `formatDriftLines([])` SHALL devolver `[]`, y la CLI
  `node env-drift.mjs <envPath> <examplePath>` SHALL escribir **cero bytes** en
  stdout y terminar con exit code 0. Este es el requisito que sostiene el
  criterio "con `.env` completo el output no cambia" (R9).

  - Test: mismo archivo, describe
    `R4 (init-env-drift-warning #23): sin deriva no hay salida`, con dos `it`:
    (a) `deepEqual(formatDriftLines([]), [])`; (b) fixture en tmpdir con un
    `.env` que contiene todas las claves del `.env.example` (más una extra
    propia), invocado con
    `execFileSync(process.execPath, [scriptPath, envPath, examplePath], { encoding: 'utf8' })`
    ⇒ `strictEqual(stdout, '')` y sin excepción (exit 0).

- **R5**: IF `.env` o `.env.example` no existe, no se puede leer, o su lectura
  lanza cualquier excepción THEN THE SYSTEM SHALL escribir cero bytes en stdout
  y terminar con exit code **0**, sin traza de excepción no capturada. El
  chequeo de deriva es un aviso: nunca puede tumbar `init.sh` ni ensuciar su
  salida.

  - Test: mismo archivo, describe
    `R5 (init-env-drift-warning #23): sin .env.example el script calla y sale
    0`, con tres `it` que invocan la CLI con `execFileSync`: (a) `examplePath`
    apuntando a un archivo inexistente del tmpdir; (b) `envPath` inexistente;
    (c) los dos inexistentes. En los tres: `stdout === ''` y `execFileSync` no
    lanza (exit 0).

- **R6**: WHILE se ejecuta por cualquier vía, THE SYSTEM SHALL NOT modificar,
  crear ni borrar ningún archivo. En concreto `env-drift.mjs` SHALL NOT
  contener ninguna de las llamadas `writeFile`, `writeFileSync`, `appendFile`,
  `appendFileSync`, `copyFile`, `copyFileSync`, `rm`, `rmSync`, `unlink`,
  `unlinkSync`, `mkdir`, `mkdirSync` ni `open`/`openSync` en modo escritura, y
  SHALL usar exclusivamente `readFileSync` de `node:fs`. Cubre el criterio de
  aceptación "init.sh nunca modifica `.env`".

  - Test: mismo archivo, describe
    `R6 (init-env-drift-warning #23): el script nunca escribe en disco`, con
    dos `it`: (a) fixture en tmpdir con deriva — se guardan `readFileSync` y
    `statSync().mtimeMs` del `.env` antes de invocar la CLI y se aseveran
    idénticos después; (b) inspección de fuente: `readFileSync` de
    `env-drift.mjs` y assertion de que **no** casa
    `/write|append|copyFile|rmSync|unlink|mkdir/` (patrón de inspección de
    fuente ya usado en el repo, `src/pipeline/validate-positions.spec.ts:84`).

### Bloque B — La integración en `init.sh`

- **R7**: WHEN `init.sh` termina la §2 (VARIABLES DE ENTORNO) THEN THE SYSTEM
  SHALL ejecutar el chequeo de deriva mediante este bloque, insertado **entre
  la línea 74** (`fi`, cierre del `if` de `REQUIRED_ENV_VARS`) **y la línea 76**
  (`# ── 3. DEPENDENCIAS`), literalmente:

  ```bash
  # Deriva de claves entre .env y .env.example (#23). Solo avisa: no copia
  # valores, no escribe .env y no aborta. El diff lo hace node —ya es
  # REQUIRED_TOOL y init.sh lo usa desde la linea 115— porque .env.example
  # esta commiteado con CRLF y sort/comm/grep de Git Bash tropiezan con ellos.
  if [ -f .env ] && [ -f .env.example ]; then
    ENV_DRIFT="$(node env-drift.mjs || true)"
    if [ -n "$ENV_DRIFT" ]; then
      while IFS= read -r drift_line; do
        warn "$drift_line"
      done <<< "$ENV_DRIFT"
    fi
  fi
  ```

  Reglas exactas:

  - **(a)** El bloque SHALL vivir **fuera** del `if [ "${#REQUIRED_ENV_VARS[@]}" -eq 0 ]`
    de la línea 47: el diff no depende de esa lista (ver R10).
  - **(b)** Cada línea devuelta por el script SHALL imprimirse con la función
    `warn()` ya existente (`init.sh:18`), que antepone `⚠️  ` y el amarillo.
    SHALL NOT introducirse una función de log nueva ni colores nuevos.
  - **(c)** El script SHALL invocarse **sin** redirigir stderr: si `node`
    revienta, el error se ve. El `|| true` es lo único que absorbe su exit
    code.
  - **(d)** SHALL NOT usarse `comm`, `diff`, `sort`, `awk`, `sed`, `grep -f`,
    `python`, `jq`, `nc` ni `lsof` en este bloque (portabilidad Git Bash / CI,
    misma razón que `port_open()`).

  - Test: `env-drift.test.mjs`, describe
    `R7 (init-env-drift-warning #23): init.sh invoca el chequeo con warn()`,
    que lee `init.sh` con `readFileSync(new URL('./init.sh', import.meta.url))`
    y asevera, con `assert.match`: (a) contiene `node env-drift.mjs || true`;
    (b) contiene `warn "$drift_line"`; (c) el bloque aparece **después** de
    `for var in "${REQUIRED_ENV_VARS[@]}"` y **antes** de
    `# ── 3. DEPENDENCIAS` (comparación de `indexOf`); (d) no contiene
    ninguno de `comm `, `sort `, `awk `, `sed `, `jq ` dentro del fragmento
    delimitado por esos dos marcadores.

- **R8**: WHILE exista deriva, THE SYSTEM SHALL NOT alterar el flujo de
  `init.sh`: el aviso SHALL NOT llamar a `fail()`, SHALL NOT ejecutar `exit`,
  y con `set -e` activo (`init.sh:4`) SHALL NOT abortar el script aunque `node`
  devuelva un exit code distinto de 0. `init.sh` SHALL conservar su exit code
  actual (0 cuando el resto de pasos pasan).

  - Test: `env-drift.test.mjs`, describe
    `R8 (init-env-drift-warning #23): el aviso no aborta`, con dos `it`:
    (a) inspección de fuente — el fragmento del bloque (delimitado como en R7)
    no contiene `fail` ni `exit`; (b) prueba real del contrato de shell:
    `execFileSync('bash', ['-c', 'set -e; OUT="$(node ' + scriptPath + ' /no/existe /tampoco || true)"; echo "rc=$?"'])`
    ⇒ la salida contiene `rc=0`, es decir un fallo del script no mata un shell
    con `set -e`.
    Verificación manual complementaria (R12 paso 3): con un `.env` incompleto,
    `./init.sh; echo $?` imprime `0`.

- **R9**: WHILE `.env` no tenga ninguna clave faltante respecto a
  `.env.example`, THE SYSTEM SHALL dejar la sección §2 de `init.sh`
  **byte a byte idéntica** a la de antes de esta feature: cero líneas nuevas,
  ninguna línea `✅` de confirmación, ningún cambio en las líneas de
  `check_env()`. El criterio se comprueba de dos formas, las dos obligatorias:

  - **(a) Automática**: por R4 la CLI escribe cero bytes, y por R7 el cuerpo
    del `while` está dentro de `if [ -n "$ENV_DRIFT" ]`, así que se ejecuta
    cero veces. El test estático SHALL aseverar que en el fragmento del bloque
    no existe ninguna llamada a `ok` ni ningún `echo` fuera del
    `if [ -n "$ENV_DRIFT" ]`.
  - **(b) Manual, con diff real**: antes de tocar `init.sh` (primera tarea de
    [[tasks]]) se captura la §2 en un archivo, y al terminar se vuelve a
    capturar y se comparan con `diff`. Extracción exacta, con un `.env` sin
    claves faltantes:

    ```bash
    ./init.sh 2>&1 | sed -n '/→ Verificando variables de entorno/,/→ Instalando dependencias/p' > /tmp/env-section-<antes|despues>.txt
    diff /tmp/env-section-antes.txt /tmp/env-section-despues.txt   # debe salir vacío
    ```

    Esa sección no contiene tiempos ni contadores, así que el diff es
    determinista. (`sed` aquí es una herramienta del humano en su terminal, no
    código de `init.sh`: la restricción de R7d no aplica.)

  - Test: `env-drift.test.mjs`, describe
    `R9 (init-env-drift-warning #23): sin deriva la seccion 2 no cambia`, con
    el `it` estático de (a). El paso (b) se registra en
    [[traceability]] §Verificación manual con el resultado del `diff`.

- **R10**: WHILE se implementa esta feature, `init.config.sh` SHALL cambiar en
  **una sola línea**: `TEST_CMD` pasa a terminar con
  `&& node --test env-drift.test.mjs`, para que la suite del harness la ejecute
  igual que `init.sh` ejecuta las de la app. THE SYSTEM SHALL NOT modificar
  `REQUIRED_ENV_VARS` (sigue valiendo `("DATABASE_URL")`) ni la función
  `check_env()` ni el bloque de copia de `.env.example` (`init.sh:50-73`): el
  chequeo nuevo **convive** con ellos, no los sustituye. Justificación en
  [[design]] §D4.

  El comando SHALL nombrar el archivo de test explícitamente: `node --test .`
  y `node --test ./` fallan en Git Bash con `Could not find '.'` (verificado en
  node v24.16.0 el 2026-08-16); pasar la ruta del archivo funciona en las dos
  plataformas.

  - Test: `env-drift.test.mjs`, describe
    `R10 (init-env-drift-warning #23): init.config.sh mantiene REQUIRED_ENV_VARS
    y ejecuta la suite`, que lee `init.config.sh` y asevera: (a) contiene
    `node --test env-drift.test.mjs`; (b) contiene
    `REQUIRED_ENV_VARS=("DATABASE_URL")` sin cambios; y lee `init.sh` para
    aseverar (c) que `check_env()` sigue presente con su cuerpo
    (`grep -q "^${var}=" .env`) y (d) que sigue existiendo el `cp .env.example .env`.

- **R11**: WHILE se implementa esta feature, THE SYSTEM SHALL NOT introducir
  ninguna variable de entorno nueva: `.env.example` y la tabla "Variables de
  entorno" de `docs/conventions.md` (§Variables de entorno) SHALL quedar **sin
  añadir ninguna fila**. La documentación que sí SHALL actualizarse es:

  - **(a)** `docs/verification.md`: bloque nuevo `### Feature 23 —
    init-env-drift-warning` al final de la sección "Verificación por feature",
    con el procedimiento manual completo de R12 y el `diff` de R9(b).
  - **(b)** `AGENTS.md` §2 (Mapa del repositorio): una fila nueva para
    `env-drift.mjs` — "Diff de claves entre `.env` y `.env.example` que usa
    `init.sh` §2 (#23)" / "Si `init.sh` avisa de claves faltantes".

  - Test: `env-drift.test.mjs`, describe
    `R11 (init-env-drift-warning #23): documentacion y cero variables nuevas`,
    con tres `it`: (a) `docs/verification.md` contiene
    `### Feature 23 — init-env-drift-warning`; (b) `AGENTS.md` contiene
    `env-drift.mjs`; (c) el conjunto de claves de `.env.example` calculado con
    `parseEnvKeys` tiene **21** elementos y no contiene ninguna clave cuyo
    nombre empiece por `DRIFT` o `ENV_DRIFT` — el chequeo no se configura por
    entorno.

- **R12**: WHEN un humano ejecute la verificación manual de esta feature THEN
  THE SYSTEM SHALL producir este resultado, reproducible en la máquina del
  repositorio y registrado en `progress/impl_init-env-drift-warning.md`:

  1. Con el `.env` actual (el del inventario del §Contexto, 8 claves
     faltantes), `./init.sh` imprime en §2 las **cuatro** líneas literales de
     R3 precedidas de `⚠️  `, con los 4 gates en la primera lista y las 4 de
     configuración en la segunda.
  2. `.env` queda **sin modificar**: `git status` no lo lista (está en
     `.gitignore:16`) y su `mtime` y su tamaño son los mismos antes y después
     (`stat -c '%Y %s' .env`).
  3. `./init.sh; echo $?` imprime `0`.
  4. Tras añadir a mano al `.env` las 8 claves faltantes, `./init.sh` no
     imprime ninguna de esas líneas y el `diff` de R9(b) sale vacío.

  - Test: no hay test automatizado — R12 **es** el procedimiento manual, y su
    evidencia (salida pegada + resultado del `diff`) va en
    `progress/impl_init-env-drift-warning.md` y en [[traceability]]
    §Verificación manual. Lo repite el `reviewer` de forma independiente.

---

## Fuera de alcance

- **Copiar o completar valores automáticamente.** El criterio de aceptación
  de `feature_list.json` es explícito: "Solo avisar: no copiar valores
  automáticamente, el humano decide qué setear". Un merge automático elegiría
  por el humano el valor de `WIALON_TOKEN` o de `AWS_MODE`, que es justo lo que
  no debe pasar.
- **Deriva inversa** (claves en `.env` que no están en `.env.example`). Ver
  [[design]] §D3: `.env` legítimamente tiene extras locales (un
  `WIALON_TOKEN` real, overrides temporales) y una clave retirada es inerte —
  no apaga nada. Reportarla sería ruido recurrente para un fallo que nunca ha
  ocurrido.
- **Comparar valores.** Que `POLLER_ENABLED=false` esté puesto a propósito no
  es deriva; distinguir "apagado a propósito" de "apagado por olvido" exige
  saber la intención del humano. Solo claves.
- **Abortar `init.sh`** cuando falten gates. Rompería el arranque del proyecto
  en cualquier máquina con un `.env` viejo, incluida la del humano en mitad de
  un debugging. R8 lo prohíbe explícitamente.
- **Validar que los valores sean del tipo esperado** (booleano, URL, entero).
  Otra feature si alguna vez hace falta; hoy nadie ha perdido una sesión por
  eso.
- **Eliminar `REQUIRED_ENV_VARS` / `check_env()`.** Ver R10 y [[design]] §D4.
- **Sincronizar `.env.example` con lo que el código realmente lee**
  (`ConfigService.get(...)` sin fila en `.env.example`). Es el fallo simétrico
  y más ambicioso: exige analizar el código de la app. Esta feature solo
  compara dos archivos.
- **Normalizar el CRLF de `.env.example`** (añadir `*.env* text eol=lf` a
  `.gitattributes`). Tentador, pero cambia un archivo commiteado por razones
  ajenas a esta feature y el parseo de R1 ya es inmune. Si se hace, va en su
  propio PR.
- **Variables de entorno nuevas**: ninguna (R11). El chequeo no se configura;
  no tiene interruptor para apagarlo — un interruptor para apagar el detector
  de apagados silenciosos sería exactamente el chiste equivocado.
- **Código de la aplicación** (`backend-pet-tracker/`, `infra/`): no se toca
  ni un archivo. Sin migraciones, sin infraestructura AWS, sin capas.

---

## Aprobación

- [X] Aprobado por humano (fecha: 26-08-16) ← gate obligatorio antes de implementar
