---
feature: "harness-e2e-nunca-corre-en-ci"
status: approved   # aprobada por humano en 0f47c176 (gate de requirements.md)
tags: [harness, spec, ci]
---

# Tareas — [[harness-e2e-nunca-corre-en-ci]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden y sujeto — léelo antes de empezar.** El orden de abajo **no es
> arbitrario**: ningún requisito asevera sobre algo que otro requisito posterior
> tenga que crear. En concreto, **R3 crea los marcadores del bloque** que R4, R5
> y R6 necesitan para rebanar `init.sh`; por eso R3 va antes que ellos. Y **R7
> va el último a propósito**: hasta que no existen los `describe` de R1-R9, meter
> la suite nueva en `TEST_CMD` dejaría `./init.sh` rojo durante toda la feature.
>
> **El único sujeto que no existe al empezar es el fichero de test.** Lo crea el
> commit rojo de R1. Cada R posterior **añade su `describe`** a ese mismo
> fichero; ninguno lo reescribe.
>
> **Commits test-primero, obligatorio (C4 de `CHECKPOINTS.md`).** Un commit por
> paso: primero el rojo que nombra su R-id, después el verde. Nada de
> implementación + tests + docs en un solo commit — en #19 eso costó un rechazo.
> Formato: `test(ci-e2e): <desc> (R1)` para el rojo y
> `feat(ci-e2e): <desc> (R1)` para el verde (`docs/conventions.md` §Commits).

---

## 0 — Precondiciones (una vez, antes de tocar nada)

- [ ] **No cargues las skills de `expo:*`.** Esta feature no toca
      `mobile-pet-tracker/`.
- [ ] Comprobar que no hay otro gate en marcha antes de correr **nada** pesado —
      los dos worktrees comparten el Postgres y el LocalStack de Docker:

      pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep

      (`pgrep -f 'bash ./init.sh'` se encuentra a sí mismo; ante un pid dudoso,
      `ps -o etime= -p <pid>`, uno de `00:00` es el propio `pgrep`.)
- [ ] **No uses `./init.sh` como bucle de trabajo.** El comando de esta feature
      es `node --test init-e2e-gate.test.mjs`. El gate completo lo corre el
      reviewer.
- [ ] Leer [[design]] §D6 (el bash exacto, ya escrito: cópialo, no lo
      reinventes) y §D7 (cómo se rebana el bloque y qué se stubbea).
- [ ] Leer `env-drift.test.mjs` y `init-color.test.mjs` **enteros**. Son el
      patrón a seguir: `node:test`, `node:assert/strict`, `execFileSync`,
      lectura de `init.sh` con `new URL('./init.sh', import.meta.url)`. No
      inventes un framework ni añadas dependencias.

---

## R1 — CI levanta Postgres y LocalStack antes de `init.sh`

- [ ] (1) Escribir test que falla para R1: **crear**
      `init-e2e-gate.test.mjs` en la raíz, con
      `describe('R1 (harness-e2e-nunca-corre-en-ci #96): CI levanta la infra antes de init.sh', ...)`.
      Lee `.github/workflows/ci.yml` y afirma: aparece
      `docker compose up -d --wait`, y su `indexOf` es **menor** que el de
      `bash ./init.sh` (mismo truco de orden que `env-drift.test.mjs` R7).
      Afirma también que el workflow **no** repite `localstack/localstack` ni
      `postgres:17` — esas etiquetas viven solo en `docker-compose.yml`.
- [ ] (2) Implementación mínima que lo pasa: en `.github/workflows/ci.yml`,
      añadir justo después de `actions/checkout@v4` el paso
      `Infra e2e (Postgres + LocalStack)` con
      `docker compose up -d --wait --wait-timeout 120` ([[design]] §D2 (b)).
- [ ] (3) Refactor con tests verdes.

## R2 — El workflow fija `AWS_MODE: local` y nunca toca AWS real

- [ ] (1) Escribir test que falla para R2, en un `describe` nuevo del mismo
      fichero. Afirma sobre `ci.yml`: aparece `AWS_MODE: local`; **no** aparece
      `AWS_MODE: aws`, ni `configure-aws-credentials`, ni
      `secrets.AWS_ACCESS_KEY_ID`, ni `secrets.AWS_SECRET_ACCESS_KEY`.
- [ ] (2) Implementación mínima: bloque `env:` a nivel de job con
      `AWS_MODE: local` y el comentario de [[design]] §D2 (a) — el que explica
      que las tres suites `aws-real-*` se saltan **por diseño** y que ponerlo en
      `aws` cuesta dinero.
- [ ] (3) Refactor con tests verdes.

## R3 — Los puertos se derivan del `.env`, no se escriben

- [ ] (1) Escribir test que falla para R3. En el mismo fichero, añadir el helper
      de rebanado de [[design]] §D7 y **hacerlo asertivo, no defensivo**:

      const a = initSh.indexOf(START), b = initSh.indexOf(END);
      assert.ok(a !== -1 && b > a, 'init.sh debe delimitar el bloque e2e con los marcadores de #96');

      **Esto importa**: en este commit los marcadores todavía no existen, y el
      rojo tiene que ser esa aserción con su mensaje, **nunca** un `TypeError`
      por rebanar con `-1`.
      El `describe` de R3 ejecuta el bloque con `port_open` stubbeado a éxito
      contra **tres** fixtures de `.env` en directorios temporales — forma de
      `wt-backend` (`…@localhost:5433/pet_tracker_wt`), forma de `.env.example`
      (`…@localhost:5432/pet_tracker`) y una con `@` en la contraseña — y afirma
      los `PROBE:` esperados, incluido `localhost:4566` desde
      `AWS_ENDPOINT_URL`. Afirma además que `init.config.sh` **no** contiene
      `E2E_REQUIRED_PORTS`, ni `5432`, ni `5433`, ni `4566`.
- [ ] (2) Implementación mínima que lo pasa: en `init.config.sh`, sustituir
      `E2E_REQUIRED_PORTS=(5432 4566)` por `E2E_PORT_SOURCES=("DATABASE_URL"
      "AWS_ENDPOINT_URL")` con su comentario ([[design]] §D6). En `init.sh`:
      cambiar `port_open` a dos argumentos `(host, puerto)`, envolver la sección
      6b con los dos marcadores, y meter dentro `env_value`, `url_host_port` y
      el bucle de derivación. **En este paso la guarda sigue llamando a `warn`**
      — el fallo duro es R4. Copia el bash de [[design]] §D6 tal cual.
- [ ] (3) Refactor con tests verdes. Comprobar que `port_open` tiene **una sola**
      llamada en todo `init.sh` y que ha quedado actualizada.

## R4 — La infra caída aborta `init.sh` con código 1

- [ ] (1) Escribir test que falla para R4. Ejecuta el bloque con `port_open`
      stubbeado a fallo y mide **sin tubería**: `execFileSync('bash', ['-c',
      script])` dentro de un `try/catch`, afirmando `err.status === 1`. Afirma
      que la salida **no** contiene `E2E`, ni `SETUP`, ni `FIN`. Repite con un
      cuarto fixture de `.env` **sin** `DATABASE_URL`: mismo `status === 1`.
      Afirma además que el bloque rebanado **no** contiene ninguna variante de
      `if [ -n "$CI" ]` (no hay rama por entorno — [[design]] §D3).
      > Si mides con `| tail` el estado es el de `tail` y el test sale verde
      > mintiendo. Ya pasó en este repo.
- [ ] (2) Implementación mínima: sustituir el `warn` de la guarda por `fail`,
      con el `||` de [[design]] §D6. `fail` ya hace `exit 1` explícito; **no**
      te apoyes en `set -e` para propagar nada.
- [ ] (3) Refactor con tests verdes.

## R5 — El mensaje de fallo dice host, puerto y clave de origen

- [ ] (1) Escribir test que falla para R5: sobre la salida capturada del caso de
      R4, afirmar que la línea `FAIL:` contiene el puerto, el host **y** el
      literal `DATABASE_URL`.
- [ ] (2) Implementación mínima: redactar el mensaje de `fail` en la forma de
      [[requirements]] R5 — `Infra e2e caída: <host>:<puerto> no responde
      (derivado de <CLAVE> en .env). Levántala con: docker compose up -d`.
- [ ] (3) Refactor con tests verdes.

## R6 — Migraciones y provisioning antes de los e2e

- [ ] (1) Escribir test que falla para R6: ejecutar el bloque con `port_open`
      stubbeado a éxito y afirmar que `SETUP` aparece **antes** que `E2E`
      (comparación de índices sobre stdout). Afirmar que `init.config.sh` define
      `E2E_SETUP_CMD` conteniendo `db:migrate` y `provision:local`, y que **no**
      contiene `psql`.
- [ ] (2) Implementación mínima: añadir `E2E_SETUP_CMD` a `init.config.sh`
      ([[design]] §D5, con su comentario) y el bloque `if [ -n
      "$E2E_SETUP_CMD" ]` en `init.sh`, entre la guarda y `eval "$E2E_CMD"`.
- [ ] (3) Refactor con tests verdes.

## R8 — El comentario deja de describir un agujero

> R8 antes que R7: R7 es el cableado final y cierra la feature.

- [ ] (1) Escribir test que falla para R8: afirmar que `init.sh` **no** contiene
      `pasa de largo sin verificar nada`, que `ci.yml` **no** contiene
      `anadir services aqui` (así, literal y sin tildes: es como está escrito en
      el fichero), y que el bloque rebanado
      **sí** contiene el comentario nuevo con `docker compose up -d`.
- [ ] (2) Implementación mínima: reescribir el comentario de cabecera de la
      sección 6b con el texto de [[design]] §D6 y el de `ci.yml` con el de
      [[design]] §D2 (c).
- [ ] (3) Refactor con tests verdes. Releer el bloque entero: no debe quedar
      **ninguna** frase que describa el salto silencioso como contrapartida
      aceptada.

## R9 — `docs/verification.md` documenta el gate y la nueva precondición

- [ ] (1) Escribir test que falla para R9: afirmar que `docs/verification.md`
      contiene `### Feature 96 — harness-e2e-nunca-corre-en-ci` (mismo candado
      que `env-drift.test.mjs` hace con `### Feature 23`).
- [ ] (2) Implementación mínima: escribir ese bloque en `docs/verification.md`
      con las tres cosas que pide [[requirements]] R9 — que `./init.sh` **ya
      exige** `docker compose up -d` y aborta si no, los pasos literales de G1 y
      G2, y que las tres suites `aws-real-*` se saltan por diseño (con la
      igualdad de §"Cómo se mide el criterio 1", **sin** congelar el 26).
      Revisar de paso la §"Verificación base → 3. Init verde": debe decir que la
      infra tiene que estar arriba.
- [ ] (3) Refactor con tests verdes.

## R7 — La suite nueva entra en el gate y en el mapa del repo

- [ ] (1) Escribir test que falla para R7: afirmar que `init.config.sh` contiene
      `node --test init-e2e-gate.test.mjs` y **sigue** conteniendo
      `node --test env-drift.test.mjs` y `node --test init-color.test.mjs`; y
      que `AGENTS.md` menciona `init-e2e-gate.test.mjs`.
- [ ] (2) Implementación mínima: añadir la invocación a `TEST_CMD` en
      `init.config.sh`, junto a las dos que ya hay, y una fila en la tabla de
      mapa de `AGENTS.md` con el mismo formato que la de `env-drift.mjs`.
- [ ] (3) Refactor con tests verdes. **Ahora sí**: `node --test
      init-e2e-gate.test.mjs` entero en verde, con un `describe` por cada R-id
      de R1 a R9.

---

## Cierre (antes de devolver al leader)

- [ ] `specs/harness-e2e-nunca-corre-en-ci/traceability.md` sin ninguna fila
      "pendiente": cada R con su test y sus dos hashes (rojo y verde).
- [ ] `progress/impl_harness-e2e-nunca-corre-en-ci.md` escrito, con el reporte
      completo. **No pegues su contenido en el chat**: vive en disco.
- [ ] **No** marques la feature `done`, no mergees y no abras el PR tú. G1 y G2
      de [[requirements]] los cierra un humano sobre el PR, y el veredicto es
      del reviewer.
- [ ] Si has tenido que tocar algún fichero fuera de la tabla de [[design]]
      §Archivos, dilo en el reporte y di por qué. Si has tocado `.env.example`,
      comprueba que has actualizado en el **mismo commit** el
      `assert.equal(keys.length, 24)` de `env-drift.test.mjs`.
