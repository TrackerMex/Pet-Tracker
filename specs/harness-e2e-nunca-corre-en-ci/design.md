---
feature: "harness-e2e-nunca-corre-en-ci"
status: approved   # aprobada por humano en 0f47c176 (gate de requirements.md)
tags: [harness, spec, ci]
---

# Diseño — [[harness-e2e-nunca-corre-en-ci]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las capas — que esta feature
> **no toca**: es harness y CI, cero código de aplicación.
>
> Todo lo que sigue se verificó **contra el árbol en `48e4130d`**, no contra el
> enunciado. Quien implemente esto no tiene acceso a la conversación que originó
> la spec: aquí está cerrada cada decisión, con el bash exacto.

---

## D1 — `docker compose up -d --wait`, **no** `services:`

**Decisión**: la infraestructura de CI se levanta con un paso
`docker compose up -d --wait --wait-timeout 120` sobre el `docker-compose.yml`
versionado del repo, **antes** del paso de `init.sh`. **No** se declara un
bloque `services:` en el workflow.

El enunciado señalaba esta como la parte con riesgo real. La evidencia que la
cierra:

1. **Reutilizar mata la deriva.** `docker-compose.yml` ya pinea
   `postgres:17-alpine` y `localstack/localstack:4.14` — este último con un
   comentario que explica por qué está pineado (*"última versión community sin
   licencia — desde la serie CalVer 2026.x la imagen exige
   `LOCALSTACK_AUTH_TOKEN` y sale con código 55"*). Un bloque `services:`
   duplicaría esas dos etiquetas, sus puertos y sus credenciales en un segundo
   fichero: dos sitios que bumpear, y el día que alguien bumpee uno solo, CI
   verifica contra una infra distinta de la local. Es exactamente el defecto que
   esta feature existe para cerrar, replantado en otro sitio.
2. **El healthcheck ya está resuelto y `services:` no lo aprovecha.** Los
   service containers de Actions **no** ejecutan el `HEALTHCHECK` que trae la
   imagen: hay que reescribirlo en el YAML con `options: --health-cmd …`. Aquí
   ya existen los dos: `docker-compose.yml` declara el de Postgres
   (`pg_isready -U pet_tracker -d pet_tracker`, interval 5s, retries 10) y la
   imagen de LocalStack trae el suyo propio — verificado con
   `docker image inspect localstack/localstack:4.14 --format
   '{{json .Config.Healthcheck}}'` sobre la imagen ya presente en esta máquina:
   `{"Test":["CMD-SHELL","/opt/code/localstack/.venv/bin/localstack status
   services --format=json"],"Interval":10s,"Timeout":10s,"StartPeriod":15s,
   "Retries":5}`. Con eso, `--wait` bloquea hasta que **los dos** estén
   `healthy` y devuelve distinto de cero si alguno queda `unhealthy`: ni
   `sleep`, ni bucle de polling, ni tercera copia del conocimiento.
   Peor caso de espera: ~65s (LocalStack: 15s de `StartPeriod` + 5 × 10s);
   `--wait-timeout 120` deja margen y evita que un cuelgue consuma el timeout
   de job de 6 horas.
3. **`docker-compose.override.yml` está gitignorado** (`.gitignore:29`,
   verificado con `git check-ignore -v`). En CI no existe, así que se aplica
   solo el fichero versionado y Postgres queda en `5432:5432` con usuario,
   contraseña y base `pet_tracker` — **exactamente** lo que dice
   `.env.example`. Cero configuración específica de CI. Ver §D4.
4. **El runner ya trae lo necesario**: `ubuntu-latest` viene con Docker Engine
   y Compose v2 preinstalados, y `--wait` existe en Compose v2. No se instala
   nada.
5. **LocalStack no necesita el socket de Docker aquí.** Ese requisito aparece
   cuando se usa Lambda (LocalStack lanza contenedores por invocación). Este
   proyecto usa SQS, DynamoDB, S3 y EventBridge — `provisionQueues`,
   `provisionPositionsTable`, `provisionMediaBucket`, `provisionEventBus`,
   `provisionGeofenceEventsRoute` en `src/aws/provisioning.ts`; ninguna Lambda.
   Aun así, `docker compose` no tiene la restricción, así que la pregunta
   desaparece con esta vía en vez de quedarse como riesgo latente.

**Alternativa descartada**: `services:` con `options: --health-cmd …` y las
imágenes repetidas en el YAML. Habría funcionado (Actions soporta `volumes`,
`env`, `ports` y `options` en un service container), pero paga el punto 1 y el
punto 2 a cambio de nada.

**Ceiling aceptado**: si un día el proyecto añade Lambda en LocalStack, hará
falta montar `/var/run/docker.sock`. Con `docker compose` eso es una línea en
`docker-compose.yml`; con `services:` habría sido una investigación.

---

## D2 — Forma exacta del workflow

`.github/workflows/ci.yml` cambia en **tres** sitios y en ninguno más.

**(a)** El job declara el modo AWS, para que R2 sea legible sin abrir `.env`:

```yaml
jobs:
  verify:
    runs-on: ubuntu-latest
    env:
      # Los e2e corren contra LocalStack, nunca contra la cuenta AWS real.
      # Las tres suites aws-real-* se auto-saltan con AWS_MODE != aws y eso es
      # deliberado: pegar a AWS real en cada PR cuesta dinero y esa prueba la
      # corre solo un humano (CLAUDE.md §Excepciones). NO lo cambies a "aws".
      AWS_MODE: local
```

> Precisión sobre precedencia, para que nadie la descubra depurando: una
> variable exportada por el runner **gana** a `dotenv`, que nunca pisa lo que ya
> está en el entorno. Aquí no hay conflicto porque `.env.example` también dice
> `AWS_MODE=local`; los dos valores coinciden a propósito.

**(b)** Un paso nuevo, **inmediatamente después de `actions/checkout@v4`** — si
la infra no arranca, el job falla antes de gastar tiempo en instalar
dependencias:

```yaml
      - name: Infra e2e (Postgres + LocalStack)
        run: docker compose up -d --wait --wait-timeout 120
```

**(c)** El comentario de la línea 36 desaparece y el bloque queda:

```yaml
      # Misma verificacion que en local: harness + install + build + test + lint + typecheck.
      # init.sh copia .env.example -> .env si falta, asi que no necesita secrets.
      # Los e2e los corre init.sh §6b contra la infra del paso anterior; si esa
      # infra no responde, init.sh aborta (no los salta). Ver specs/
      # harness-e2e-nunca-corre-en-ci/.
      - name: Harness verification (init.sh)
        run: bash ./init.sh
```

No se toca `pnpm/action-setup`, ni `setup-node`, ni `setup-bun`, ni la caché de
bun. No se añade `timeout-minutes` (el default de 6 h sobra y un número aquí
sería una constante que caduca cuando la suite crezca). No se añade
`docker compose down`: el runner es efímero.

---

## D3 — Fallo duro **siempre**, sin rama por `$CI`

**Decisión**: la infra que falta aborta `init.sh` con `exit 1` en todas las
máquinas. No hay `if [ -n "$CI" ]`.

Se consideró el fallo duro solo en CI y **se descarta**:

1. **No hay a quién proteger.** Nadie corre `init.sh` a propósito con la infra
   abajo; la receta de trabajo de este repo empieza por `docker compose up -d`
   (`docs/conventions.md` §Sesiones en paralelo, `docs/verification.md`
   §Feature 28, `docs/demo-runbook.md`).
2. **Una rama condicional es una segunda ruta sin probar.** La rama local
   quedaría ejercitada a diario y la de CI una vez por PR; la que de verdad
   importa sería la que menos se mira. Un solo camino se rompe de una sola
   manera.
3. **El coste real de equivocarse es al revés.** Con `warn`, el modo de fallo es
   *verde sin haber verificado nada* — el defecto que abre esta feature, y que
   ya mordió dos veces el 2026-09-15. Con `fail`, el modo de fallo es *rojo
   ruidoso con un mensaje que dice qué levantar*: R5 hace que esos treinta
   segundos se resuelvan leyendo una línea.

**Mecanismo, explícito por `set -e`** (`init.sh:4`): se usa el helper `fail` que
ya existe (`init.sh:19`), que hace `echo` en rojo y **`exit 1` explícito**. No se
depende de `set -e` para propagar nada: `set -e` aborta ante un comando que
devuelve distinto de cero, pero aquí la llamada va en la posición derecha de un
`||`, donde `set -e` **no** dispara — por eso el `exit` tiene que estar dentro de
`fail`, y lo está. Código de salida del proceso: `1`.

**Medición sin tubería** (R4): `./init.sh | tail` devuelve el código de `tail`.
El test de R4 mide con `execFileSync('bash', [...])` y lee `err.status`, sin
`|` de por medio. Este repo ya dio un gate por verde midiendo tras un pipe.

---

## D4 — `DATABASE_URL` en CI: no se fija en el workflow

**Decisión**: el workflow **no** exporta `DATABASE_URL`. `init.sh` copia
`.env.example` → `.env` (`init.sh:58-62`) y ese valor es ya el correcto.

Cuadre, línea por línea:

| | `.env.example` | `docker-compose.yml` en CI |
|---|---|---|
| host:puerto | `localhost:5432` | `ports: "5432:5432"` (sin override) |
| usuario | `pet_tracker` | `POSTGRES_USER: pet_tracker` |
| contraseña | `pet_tracker` | `POSTGRES_PASSWORD: pet_tracker` |
| base | `pet_tracker` | `POSTGRES_DB: pet_tracker` |

Coinciden los cuatro. Fijar `DATABASE_URL` en el workflow sería una quinta copia
del mismo dato y, además, **abre la trampa de precedencia**: `dotenv` no pisa una
variable ya exportada, así que a partir de ahí el `.env` y el entorno podrían
divergir sin que nadie lo note. No se hace.

En el VPS el cuadre es distinto y también automático: `docker-compose.override.yml`
remapea a `5433` y cada worktree apunta su `.env` a su base
(`pet_tracker` / `pet_tracker_wt`). Como D6 deriva del `.env`, los tres entornos
salen del mismo código sin una sola rama.

---

## D5 — Migraciones y provisioning: `E2E_SETUP_CMD` en `init.config.sh`

**Decisión**: una variable nueva en `init.config.sh`, ejecutada por `init.sh`
dentro de la sección 6b, **después** de la guarda de puertos y **antes** de
`E2E_CMD`:

```bash
# Puesta a punto de la infra antes de los e2e (#96). Corre solo cuando los
# puertos de E2E_PORT_SOURCES responden, así que en una máquina sin Docker
# nunca se llega aquí. Los dos comandos son idempotentes:
#   - db:migrate escribe el .sql Y su fila en drizzle.__drizzle_migrations
#     (nunca psql crudo — docs/conventions.md); sobre un journal al día no hace
#     nada, sobre un Postgres limpio de CI crea el esquema entero.
#   - provision:local recorre PROVISIONED_SUFFIXES ('' y 'test'), así que la
#     misma llamada crea los recursos de desarrollo y los -test que usan los
#     e2e bajo NODE_ENV=test.
E2E_SETUP_CMD="pnpm -C backend-pet-tracker run db:migrate && pnpm -C backend-pet-tracker run provision:local"
```

### Por qué va aquí y no en el workflow

Los dos comandos necesitan `node_modules`, y quien instala es `INSTALL_CMD`
(`init.sh` §3). Un paso de migración en `ci.yml` **antes** de `init.sh` fallaría
sin dependencias, y meterlas con un `pnpm install` extra duplicaría el install.
Dentro de 6b ya están instaladas, y de paso el arreglo sirve a cualquier
worktree con base recién creada — que hoy exige acordarse del paso 3 de la
receta de `docs/conventions.md`.

### Por qué hace falta `provision:local` y no basta la propia suite

`localstack-provisioning.e2e-spec.ts` provisiona en su `beforeAll`
(`runProvisioning(process.env)`), pero **eso solo salva a las suites que corran
después**. Jest ordena los ficheros por tamaño descendente y ese no es el
primero: `ls -S test/*.e2e-spec.ts` sobre `48e4130d` da
`devices`, `device-subscriptions`, `alerts-center-notifier`, `pets`, … Es decir,
sobre un LocalStack recién arrancado, las suites grandes corren antes de que
nadie haya creado una cola. En el VPS eso no se nota porque el LocalStack lleva
horas levantado y provisionado; en CI arranca vacío en cada job (la persistencia
de estado es función de LocalStack Pro, y este está en community).

Depender del orden de ficheros de jest para que CI esté verde es exactamente la
clase de verde-por-casualidad que esta feature cierra. Un comando idempotente
elimina la dependencia, y es además **la receta que ya documenta**
`docs/verification.md` §Feature 28: `docker compose up -d` →
`provision:local` → `test:e2e`.

**Alternativa descartada**: `NODE_ENV=test pnpm … provision:local` como segunda
invocación para los recursos `-test`. Innecesaria: `runProvisioning` ya recorre
`PROVISIONED_SUFFIXES = ['', RESOURCE_SUFFIX_TEST]`
(`src/aws/resource-names.ts:18-21`) en un solo pase.

---

## D6 — Derivación de puertos: parsear el `.env`, no listar números

**Decisión**: `E2E_REQUIRED_PORTS` **desaparece**. `init.config.sh` declara de
qué claves se saca la infra, y `init.sh` parsea host y puerto de cada una.

```bash
# init.config.sh — sustituye a E2E_REQUIRED_PORTS=(5432 4566)
# De qué claves del .env se deriva la infra que los e2e necesitan. Aquí NO se
# escriben puertos: el 5432 de antes era falso en esta máquina (el Postgres del
# proyecto escucha en 5433 por docker-compose.override.yml) y la guarda pasaba
# porque respondía OTRO Postgres ajeno al proyecto. LocalStack no tiene variable
# propia: su endpoint es AWS_ENDPOINT_URL.
E2E_PORT_SOURCES=("DATABASE_URL" "AWS_ENDPOINT_URL")
```

### Por qué desaparece la variable en vez de rellenarse derivada

El criterio de aceptación 3 pide que `E2E_REQUIRED_PORTS` *"deje de depender de
un puerto fijo equivocado"*. Se cumple borrándola: no queda ningún sitio donde
escribir un puerto a mano, que es la propiedad que se quiere. Se deja dicho aquí
para que nadie lea su ausencia como un descuido.

### Por qué host **y** puerto, no solo puerto

`port_open` mira hoy `127.0.0.1` fijo (`init.sh:31`). Si `DATABASE_URL` apunta a
otro host, comprobar `127.0.0.1` da una respuesta sobre una máquina que no es la
que van a usar los tests — la misma clase de falso positivo que el Postgres
ajeno del 5432. Se parsea el host y se usa: `/dev/tcp/$host/$port` acepta
`localhost` igual que una IP. `port_open` pasa a tomar **dos** argumentos; es su
única llamada en todo el script (definición en 31, uso en 229).

### El bash exacto

`port_open` (sustituye a `init.sh:31-35`, mismo sitio):

```bash
# ¿Hay algo escuchando en host:puerto? Sin dependencias externas: nc/lsof no
# están garantizados en Git Bash ni en los runners.
port_open() {
  (exec 3<>"/dev/tcp/$1/$2") 2>/dev/null || return 1
  exec 3<&-
  return 0
}
```

El resto vive **dentro** del bloque de la sección 6b, entre marcadores, para que
el test pueda rebanarlo y ejecutarlo aislado (§D7):

```bash
# ── 6b. TESTS E2E ────────────────────────────
# >>> bloque e2e (#96) >>>
# Los e2e necesitan Postgres + LocalStack arriba. Si la infra no responde, esto
# ABORTA: antes se saltaba con un aviso, y donde de verdad importaba —CI— el
# gate salía verde sin haber ejecutado ni una suite. Levanta la infra con
# `docker compose up -d`; en CI la levanta el paso previo del workflow.
# Los puertos no están escritos aquí: se derivan del .env, que es lo que el
# backend usa de verdad (5433 en el VPS por docker-compose.override.yml, 5432
# en CI, donde ese override no existe porque está gitignorado).
if [ -n "$E2E_CMD" ]; then
  echo ""
  echo "→ Tests e2e..."

  # Último valor de una clave del .env, sin CR final: .env.example está
  # commiteado con CRLF (misma razón que env-drift.mjs, #23).
  env_value() {
    [ -f .env ] || return 0
    sed -n "s/^[[:space:]]*$1[[:space:]]*=[[:space:]]*//p" .env | tail -n 1 | tr -d '\r'
  }

  # "host puerto" de una URL scheme://[user:pass@]host:port[/path].
  # El ## es greedy a propósito: una contraseña que contenga @ no rompe el
  # parseo, porque el último @ es siempre el separador de credenciales.
  url_host_port() {
    local rest="${1##*@}"
    rest="${rest#*://}"
    rest="${rest%%/*}"
    case "$rest" in
      *:*) echo "${rest%:*} ${rest##*:}" ;;
      *)   echo "" ;;
    esac
  }

  for e2e_key in "${E2E_PORT_SOURCES[@]}"; do
    e2e_hp="$(url_host_port "$(env_value "$e2e_key")")"
    [ -n "$e2e_hp" ] || fail "No se pudo derivar host:puerto de ${e2e_key} en .env — los e2e no se pueden verificar sin saber contra qué corren"
    e2e_host="${e2e_hp% *}"
    e2e_port="${e2e_hp#* }"
    port_open "$e2e_host" "$e2e_port" \
      || fail "Infra e2e caída: ${e2e_host}:${e2e_port} no responde (derivado de ${e2e_key} en .env). Levántala con: docker compose up -d"
  done

  if [ -n "$E2E_SETUP_CMD" ]; then
    eval "$E2E_SETUP_CMD" 2>&1
    ok "Esquema y recursos e2e listos"
  fi

  eval "$E2E_CMD" 2>&1
  ok "Tests e2e pasados"
else
  warn "E2E_CMD vacío en init.config.sh — se saltan tests e2e"
fi
# <<< bloque e2e (#96) <<<
```

Comprobaciones del parseo, a mano, sobre los valores reales de los dos árboles:

| entrada | `${1##*@}` | `#*://` | `%%/*` | salida |
|---|---|---|---|---|
| `postgresql://pet_tracker:pet_tracker@localhost:5433/pet_tracker_wt` | `localhost:5433/pet_tracker_wt` | (sin cambio) | `localhost:5433` | `localhost 5433` |
| `postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker` | `localhost:5432/pet_tracker` | (sin cambio) | `localhost:5432` | `localhost 5432` |
| `http://localhost:4566` | (sin cambio) | `localhost:4566` | `localhost:4566` | `localhost 4566` |
| `postgresql://u:p@ss@localhost:5433/db` | `localhost:5433/db` | (sin cambio) | `localhost:5433` | `localhost 5433` |

**Ceiling aceptado**: una URL **sin** puerto explícito (`postgresql://host/db`)
cae en la rama `*)` y aborta por R4 con el mensaje de "no se pudo derivar". No se
implementan puertos por defecto según el esquema: hoy las dos claves los llevan
siempre, y abortar es la respuesta correcta — el error alternativo sería
comprobar un puerto que nadie pidió y volver a pasar por el motivo equivocado.

---

## D7 — El test del harness: rebanar el bloque, no correr `init.sh`

**Decisión**: un fichero nuevo `init-e2e-gate.test.mjs` en la raíz, con
`node:test` y `node:assert/strict`, ejecutado por `TEST_CMD`. **Sin framework
nuevo, sin dependencias nuevas, sin directorio nuevo.** Mismo patrón, mismo
sitio y mismo estilo que `env-drift.test.mjs` e `init-color.test.mjs`.

El test **nunca ejecuta `./init.sh` entero** (tardaría minutos y exigiría la
infra). Reutiliza la técnica que ya usa `init-color.test.mjs`, que extrae la
línea de `nodeq()` de `init.sh` y la ejecuta suelta bajo `bash -c`. Aquí el
fragmento es multilínea, así que se rebana entre los dos marcadores del bloque:

```js
const initSh = readFileSync(new URL('./init.sh', import.meta.url), 'utf8');
const START = '# >>> bloque e2e (#96) >>>';
const END = '# <<< bloque e2e (#96) <<<';
const bloque = initSh.slice(initSh.indexOf(START), initSh.indexOf(END));
```

y se ejecuta en un directorio temporal con un `.env` de fixture y los helpers
del script **stubbeados**, de modo que cada rama sea observable:

```js
function corre({ env, portOpen, ci }) {            // devuelve {status, stdout}
  const script = [
    'set -e',
    'ok(){ echo "OK:$1"; }',
    'warn(){ echo "WARN:$1"; }',
    'fail(){ echo "FAIL:$1"; exit 1; }',
    `port_open(){ echo "PROBE:$1:$2"; return ${portOpen ? 0 : 1}; }`,
    'E2E_PORT_SOURCES=("DATABASE_URL" "AWS_ENDPOINT_URL")',
    'E2E_SETUP_CMD=\'echo SETUP\'',
    'E2E_CMD=\'echo E2E\'',
    `cd ${JSON.stringify(dirFixture)}`,
    bloque,
    'echo FIN',
  ].join('\n');
  // execFileSync('bash', ['-c', script]) — SIN tubería: el código de salida se
  // lee de err.status, no del de un `tail`.
}
```

Cobertura por R-id (los nombres exactos van en [[traceability]]):

- **R1, R2** — aserciones estáticas sobre `.github/workflows/ci.yml`: existe un
  paso con `docker compose up -d --wait`, su índice en el fichero es **menor**
  que el del paso `bash ./init.sh` (mismo truco de orden que
  `env-drift.test.mjs` R7 con `indexOf`), y **no** aparecen
  `configure-aws-credentials` ni `secrets.AWS_ACCESS_KEY_ID`. Además el YAML no
  contiene la etiqueta `localstack/localstack` ni `postgres:` (viven solo en
  `docker-compose.yml`).

  Para `AWS_MODE`, ver la **enmienda E1** al final de este documento: la
  redacción original de esta viñeta (`aparece AWS_MODE: local` y **no** aparece
  `AWS_MODE: aws`) deja pasar dos formas de fijarlo en `aws`.
- **R3** — `corre()` con `portOpen: true` y tres fixtures de `.env` (forma de
  `wt-backend` con 5433, forma de `.env.example` con 5432, y una contraseña con
  `@`): el stub de `port_open` imprime `PROBE:localhost:5433`,
  `PROBE:localhost:4566`, etc. Más: `init.config.sh` **no** contiene
  `E2E_REQUIRED_PORTS`, ni `5432`, ni `4566`, ni `5433`.
- **R4** — `corre()` con `portOpen: false`: `status === 1`, la salida **no**
  contiene `E2E` ni `SETUP` ni `FIN`. Y un cuarto fixture con `.env` sin
  `DATABASE_URL`: mismo `status === 1`. Se afirma también que el bloque llama a
  `fail` y **no** llama a `warn` en la rama de puerto caído, y que `init.sh` no
  contiene ninguna variante de `if [ -n "$CI" ]` dentro del bloque (no hay rama
  por entorno, D3).
- **R5** — sobre la salida de R4: la línea `FAIL:` contiene el puerto, el host y
  el literal `DATABASE_URL`.
- **R6** — `corre()` con `portOpen: true`: la salida contiene `SETUP` **antes**
  que `E2E` (comparación de índices). Y `init.config.sh` define `E2E_SETUP_CMD`
  con `db:migrate` y con `provision:local`, sin `psql`.
- **R7** — `init.config.sh` contiene `node --test init-e2e-gate.test.mjs` y
  conserva las dos invocaciones que ya había (`env-drift.test.mjs`,
  `init-color.test.mjs`); `AGENTS.md` menciona `init-e2e-gate.test.mjs`.
- **R8** — `init.sh` **no** contiene `pasa de largo sin verificar nada`;
  `ci.yml` **no** contiene `añadir services aquí` (ni su variante sin tilde);
  el bloque rebanado contiene el comentario nuevo (`docker compose up -d`).
- **R9** — `docs/verification.md` contiene
  `### Feature 96 — harness-e2e-nunca-corre-en-ci`. Mismo candado que
  `env-drift.test.mjs` R11 hace con `### Feature 23`.

**Por qué marcadores de comentario y no `sed -n '226,245p'`**: un rango de
líneas caduca al primer diff. Los marcadores sobreviven a cualquier edición del
bloque, y si alguien los borra el test falla ruidosamente en vez de rebanar el
trozo equivocado.

---

## Archivos afectados

Ninguno pertenece a una capa de `docs/architecture.md`: esta feature no toca
dominio, aplicación ni infraestructura de la app.

| Archivo | Qué cambia | R-ids |
|---|---|---|
| `.github/workflows/ci.yml` | `env: AWS_MODE: local`; paso `docker compose up -d --wait` tras el checkout; comentario de la línea 36 reescrito | R1, R2, R8 |
| `init.sh` | `port_open` pasa a `(host, puerto)`; sección 6b entre marcadores: helpers de parseo, guarda que aborta, `E2E_SETUP_CMD`, comentario reescrito | R3, R4, R5, R6, R8 |
| `init.config.sh` | `E2E_REQUIRED_PORTS` → `E2E_PORT_SOURCES`; `E2E_SETUP_CMD` nueva; `TEST_CMD` suma la suite nueva | R3, R6, R7 |
| `init-e2e-gate.test.mjs` | **Nuevo**, en la raíz | R1-R9 |
| `AGENTS.md` | Una fila en la tabla de mapa del repo | R7 |
| `docs/verification.md` | Bloque `### Feature 96` | R9 |

**Dos ficheros fuera de la lista declarada en `feature_list.json`, y por qué:**

- **`init-e2e-gate.test.mjs`**: el criterio de aceptación 4 pide literalmente un
  test del propio harness y señala el precedente. Ese precedente son dos
  ficheros `.mjs` en la raíz invocados desde `TEST_CMD`; ponerlo en otro sitio
  inventaría una convención nueva para nada.
- **`AGENTS.md`**: `env-drift.test.mjs` afirma, en su último `describe`, que
  `AGENTS.md` menciona `env-drift.mjs` — la convención vigente es que todo
  fichero de harness en la raíz tiene su fila en el mapa. Un fichero nuevo sin
  fila la rompe.

**Condicional, solo si G1 lo destapa**: `.env.example`. Si alguna de las suites
falla en un runner limpio por una clave ausente o vacía (candidata:
`RESET_LINK_HOST=`), se corrige ahí. **Si se toca, hay que tocar en el mismo
commit el `assert.equal(keys.length, 24)` del último `describe` de
`env-drift.test.mjs`**: es un candado de longitud y salta con cualquier clave
nueva. Cualquier otro fichero que haga falta se declara en
`progress/impl_harness-e2e-nunca-corre-en-ci.md` antes de tocarlo.

---

## Lo que esta spec **no** resuelve y deja anotado

- **El flake de móvil sigue ahí.** `mobile-add-pet-photo-test-flake` está
  `pending` y puede poner CI en rojo sin que nadie haya tocado código — pasó en
  el PR #132, en un runner limpio de `ubuntu-latest`. A partir de esta feature,
  un CI rojo tiene dos causas posibles más que antes; por eso G1 y G2 de
  [[requirements]] obligan a leer **qué** falló, no solo el color.
- **Duración del job.** Los e2e corren con `maxWorkers: 1`
  (`test/jest-e2e.json`), así que el job se alarga. No se mide aquí ni se
  optimiza: es coste esperado de verificar lo que hasta ahora no se verificaba.
- **Coste de una corrida en fresco.** Nunca se ha corrido esta suite sobre un
  Postgres y un LocalStack recién creados. D5 elimina las dos causas conocidas
  (esquema y recursos); si aparece una tercera, la destapa G1 y se corrige en
  esta misma rama.

---

## Enmienda E1 — el candado de `AWS_MODE` cubre todas las formas

**Estado: pendiente de firma humana.** Esta enmienda se aprueba por separado;
el resto del documento ya está aprobado en `0f47c176` y no se reabre.

**Por qué.** El reviewer de #96 demostró con mutaciones que las aserciones que
fijaba §D7 para R2 dejan pasar dos formas de poner `AWS_MODE` en `aws`, con la
suite en verde:

```yaml
run: AWS_MODE=aws bash ./init.sh     # forma de shell, YAML válido
```

```yaml
env:
  AWS_MODE: local
  AWS_MODE: "aws"                    # segunda ocurrencia, la primera intacta
```

R2 **no** cambia: su redacción ya exigía que el workflow no contenga "ningún
paso que ponga `AWS_MODE` en `aws`". Lo que estaba corto era el candado que
§D7 prescribía para comprobarlo, no el requisito. Esto es lo que se corrige.

Importa porque es la cara de dinero de la feature: con `AWS_MODE=aws` las tres
suites `aws-real-*` dejan de auto-saltarse y CI pega a la cuenta AWS real en
cada PR. El gasto está cortado aguas abajo por el guard `runSmoke`, así que el
agujero no es explotable hoy por accidente; se cierra porque el candado existe
precisamente para que un cambio futuro del workflow no pueda colarlo en
silencio.

**Qué se prescribe.** La aserción de R2 sobre `ci.yml` pasa a comprobar las
dos cosas:

1. **`AWS_MODE` aparece exactamente una vez** en el fichero, y su valor es
   `local` (con o sin comillas). Una segunda ocurrencia es fallo, diga lo que
   diga.
2. **Ningún `run:` contiene `AWS_MODE=`**, en ninguna forma.

Basta con que las dos mutaciones de arriba pongan la suite en rojo; el
implementador elige el parseo. Una expresión del estilo
`/AWS_MODE\s*[:=]\s*["']?aws\b/i` cubre la segunda condición y parte de la
primera, pero **no** sustituye al recuento de ocurrencias: un segundo
`AWS_MODE: "local"` seguido de la línea real no lo detectaría, y el objetivo es
que el valor efectivo sea inequívoco al leer el fichero.

**Verificación de la enmienda**: las dos mutaciones de arriba, aplicadas sobre
una copia del árbol, ponen `node --test init-e2e-gate.test.mjs` en rojo; el
`ci.yml` real sigue en verde.

### Aprobación de E1

- [X] Aprobada por humano (fecha: 2026-09-15) ← gate obligatorio antes de implementar
