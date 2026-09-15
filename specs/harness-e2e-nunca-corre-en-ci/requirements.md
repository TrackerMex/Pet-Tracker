---
feature: "harness-e2e-nunca-corre-en-ci"
status: spec_ready   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec, ci]
---

# Requisitos — [[harness-e2e-nunca-corre-en-ci]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas — en particular **D1** (por qué
> `docker compose` y no `services:`), **D3** (fallo duro siempre) y **D5**
> (migraciones y provisioning en CI).
>
> **Commit base de toda medición**: `48e4130d`
> (`Merge pull request #132 from TrackerMex/docs/72-tercer-avistamiento`).
> Ningún requisito congela recuentos absolutos de suites ni de tests: lo que se
> mide es el delta contra ese commit y la **consistencia interna** de cada
> fichero. Donde abajo aparece un número medido (26 de 29), aparece como
> **evidencia fechada**, nunca como aserción.

## Contexto en una línea

Los e2e de `backend-pet-tracker/test/` **no se ejecutan nunca en CI**, así que
todo PR se mergea sin verificarlos. Dos causas encadenadas:

1. `.github/workflows/ci.yml` no levanta infraestructura: su único paso es
   `bash ./init.sh` sobre `ubuntu-latest`, sin Postgres ni LocalStack. La línea
   36 lleva el comentario *"Cuando existan tests e2e contra Postgres/LocalStack,
   anadir services aqui"* (literal, sin tildes), escrito antes de que
   existieran y nunca atendido.
2. `init.sh:226-245` salta los e2e con un **`warn`, no con un fallo**, si algún
   puerto de `E2E_REQUIRED_PORTS` no responde. El propio `init.sh:224-225`
   documenta la contrapartida por escrito: *"donde de verdad importa — CI — la
   infra debe estar levantada, o este paso pasa de largo sin verificar nada"*.
   Eso es exactamente lo que ocurre.

Defecto en la misma zona: `E2E_REQUIRED_PORTS=(5432 4566)` en
`init.config.sh:36`, pero el Postgres del proyecto escucha en **5433** en el VPS
(`docker-compose.override.yml`, gitignorado, lo remapea porque algo ajeno ocupa
`127.0.0.1:5432`). `port_open` (`init.sh:31`, vía `/dev/tcp/127.0.0.1/$1`) da
true **por ese Postgres ajeno**: la guarda pasa por el motivo equivocado.

La forma de fallo es siempre la misma: **verde sin haber ejecutado nada.**

## Requisitos funcionales

### CI levanta la infraestructura

- **R1**: WHEN el job `verify` de `.github/workflows/ci.yml` arranca, THE
  SYSTEM SHALL ejecutar, en un paso **anterior** al de `bash ./init.sh`,
  `docker compose up -d --wait --wait-timeout 120` desde la raíz del repo, de
  modo que Postgres y LocalStack queden en estado `healthy` antes de que
  `init.sh` empiece. El paso SHALL usar el `docker-compose.yml` versionado del
  repo — sin duplicar en el YAML del workflow ninguna etiqueta de imagen ni
  ningún número de puerto (ver [[design]] §D1 y §D2).

- **R2**: WHILE el job `verify` está en ejecución, THE SYSTEM SHALL mantener
  `AWS_MODE` con el valor `local`, y el workflow SHALL NOT contener ningún
  paso que ponga `AWS_MODE` en `aws`, ni credenciales de una cuenta AWS real
  (ni `aws-actions/configure-aws-credentials`, ni `AWS_ACCESS_KEY_ID` /
  `AWS_SECRET_ACCESS_KEY` desde `secrets`). Las tres suites `aws-real-*` se
  auto-saltan con `(runSmoke ? describe : describe.skip)` y **eso es el
  comportamiento correcto, no un agujero**: la prueba contra la cuenta real
  cuesta dinero y la corre solo un humano (`CLAUDE.md` §Excepciones).

### Los puertos dejan de estar escritos a mano

- **R3**: WHEN `init.sh` llega a la sección 6b, THE SYSTEM SHALL derivar el par
  `host:puerto` que debe responder **leyendo del `.env` de la raíz** el valor de
  cada clave declarada en `E2E_PORT_SOURCES` (`init.config.sh`) y extrayendo de
  esa URL su host y su puerto, y `init.config.sh` SHALL NOT contener ningún
  literal numérico de puerto ni la variable `E2E_REQUIRED_PORTS`.
  Las fuentes son `DATABASE_URL` y `AWS_ENDPOINT_URL` — LocalStack no tiene
  variable propia, su endpoint es `AWS_ENDPOINT_URL`. La derivación SHALL
  producir el puerto correcto en los **tres** entornos sin ninguna rama
  condicional: `5433` en `/home/claude/sites/Pet-Tracker-wt-backend`
  (`…@localhost:5433/pet_tracker_wt`), `5433` en el árbol principal del VPS, y
  `5432` en CI (donde `docker-compose.override.yml` no existe porque está
  gitignorado y `init.sh` copia `.env.example`, que dice 5432). Una contraseña
  que contenga `@` SHALL seguir dando el host correcto.

### El salto deja de ser silencioso

- **R4**: IF alguna fuente de `E2E_PORT_SOURCES` no responde en su
  `host:puerto`, o su valor falta en `.env` o no permite derivar un puerto,
  THEN THE SYSTEM SHALL abortar `init.sh` mediante el helper `fail` existente
  (mensaje en rojo + `exit 1` explícito, **no** un retorno dependiente de
  `set -e`) **sin ejecutar `E2E_CMD` ni `E2E_SETUP_CMD`**, y el proceso SHALL
  terminar con código de salida `1`. Ese código se mide **sin tubería**: un
  `./init.sh | tail` devuelve el código de `tail`, no el de `init.sh`, y este
  repo ya dio un gate por verde así.
  El fallo es **siempre**, no solo en CI: no hay nadie que corra `init.sh` a
  propósito con la infra abajo, y una rama condicional por `$CI` sería una
  segunda ruta sin probar en la máquina de nadie (ver [[design]] §D3).

- **R5**: WHEN `init.sh` aborta por R4, THE SYSTEM SHALL emitir un mensaje que
  nombre las **tres** cosas: el host, el puerto, y la **clave del `.env` de la
  que se derivó**, de modo que un rojo por infraestructura caída se distinga de
  un rojo por tests a simple vista y sin abrir el YAML. Ejemplo de la forma
  exigida: `Infra e2e caída: localhost:5433 no responde (derivado de
  DATABASE_URL en .env). Levántala con: docker compose up -d`.

### Un Postgres limpio tiene esquema, y LocalStack sus recursos

- **R6**: WHEN todas las fuentes de R3 responden, THE SYSTEM SHALL ejecutar
  `E2E_SETUP_CMD` (`init.config.sh`) **antes** de `E2E_CMD`, y `E2E_SETUP_CMD`
  SHALL aplicar las migraciones con `pnpm -C backend-pet-tracker run db:migrate`
  — **nunca con `psql` crudo** (`docs/conventions.md` §"Nunca apliques una
  migración con `psql` crudo") — y provisionar los recursos de LocalStack con
  `pnpm -C backend-pet-tracker run provision:local`. IF `E2E_SETUP_CMD` falla,
  THEN `init.sh` SHALL abortar sin ejecutar `E2E_CMD`.
  Verificado en el árbol: nada en `test/` ni en `test/jest-e2e.json` aplica
  migraciones (grep de `migrate`, `drizzle-kit` y `__drizzle_migrations` sobre
  `test/` da cero), y `runProvisioning` recorre `PROVISIONED_SUFFIXES`
  (`src/aws/resource-names.ts:18-21`, `['', 'test']`), así que **una sola**
  invocación crea los recursos de desarrollo y los `-test` que usan los e2e.

### El candado del propio harness

- **R7**: WHEN se ejecuta `TEST_CMD`, THE SYSTEM SHALL ejecutar también
  `node --test init-e2e-gate.test.mjs`, y `AGENTS.md` SHALL listar ese fichero
  en su tabla de mapa del repositorio. Mismo patrón y mismo sitio que
  `env-drift.test.mjs` e `init-color.test.mjs`: fichero `.mjs` en la raíz, test
  runner de Node, sin framework nuevo y sin dependencias nuevas.

### El comentario deja de describir un agujero

- **R8**: WHEN alguien lee la sección 6b de `init.sh`, THE SYSTEM SHALL
  presentarle un comentario que describa el comportamiento **vigente** — la
  infra que falta aborta el gate, los puertos se derivan del `.env`, en CI la
  levanta el paso previo del workflow — y el texto de `init.sh` SHALL NOT
  contener ya la frase `"o este paso pasa de largo sin verificar nada"` ni
  ninguna variante que describa el agujero como contrapartida aceptada.
  El comentario de `.github/workflows/ci.yml:36` (*"Cuando existan tests e2e
  contra Postgres/LocalStack, anadir services aqui"*, literal, sin tildes) SHALL
  desaparecer igualmente: la tarea que pedía está hecha.

### Documentación

- **R9**: WHEN un humano abre `docs/verification.md`, THE SYSTEM SHALL
  encontrar un bloque `### Feature 96 — harness-e2e-nunca-corre-en-ci` que
  documente (a) que `./init.sh` **ya requiere** `docker compose up -d` y falla
  si no lo está, (b) los pasos exactos de los gates humanos G1 y G2 de esta
  spec, y (c) que las tres suites `aws-real-*` se saltan por diseño y que el
  verde correcto es "todas las suites menos esas tres".

## Cómo se mide el criterio 1 sin congelar un número

El criterio de aceptación 1 pide *"una corrida de CI muestra el recuento de
suites e2e distinto de cero"*. **No se escribe aquí ningún número como
aserción** — un recuento absoluto caduca y ya ha parado el trabajo tres veces en
este repo. Lo que se afirma es una igualdad interna, comprobable sobre el commit
que se esté mirando:

> suites e2e **ejecutadas** = (número de ficheros
> `backend-pet-tracker/test/*.e2e-spec.ts`) − (número de ficheros
> `backend-pet-tracker/test/aws-real-*.e2e-spec.ts`), y ese resultado es
> **distinto de cero**.

**Evidencia fechada, no aserción**: la sesión Backend corrió la suite completa
contra `48e4130d` el 2026-09-15, con exit 0 medido **sin tubería**, y obtuvo
`Test Suites: 3 skipped, 26 passed, 26 of 29 total` /
`Tests: 8 skipped, 367 passed, 375 total`. Ni un rojo de lógica ni de esquema.
Es decir: en `48e4130d` la igualdad de arriba da 29 − 3 = 26. Si mañana alguien
añade un `*.e2e-spec.ts`, la igualdad sigue siendo cierta y el 26 no.

## Fuera de alcance

- **Perseguir un 29/29 poniendo `AWS_MODE=aws` en el workflow. Prohibido por
  R2.** Es la trampa obvia de esta feature: las tres suites `aws-real-*` se
  saltan solas porque `AWS_MODE` no es `aws`, y "arreglarlo" haría que CI pegue
  a la cuenta AWS real **en cada PR** — cuesta dinero y viola la regla de
  `CLAUDE.md` de que nada que cree recursos AWS reales se delega a una IA. El
  3-saltadas es el estado correcto y R9 lo deja documentado para que ningún
  lector futuro lo confunda con un agujero.
- **El flake de móvil no se toca.** `src/screens/add-pet/index.test.tsx` (foto)
  y `src/screens/alerts/index.test.tsx` (`#78 R4`) ya ponen CI en rojo de forma
  intermitente — el PR #132, que no tocaba ni una línea de código, falló en un
  runner limpio por el segundo. Es la feature `mobile-add-pet-photo-test-flake`,
  aún `pending`, y esta spec no la aborda. **Sí** obliga al gate G2 a
  distinguir un rojo del probe de un rojo del flake.
- **No se toca ningún `*.e2e-spec.ts`, ni `test/jest-e2e.json`, ni una línea de
  `backend-pet-tracker/src/`, ni nada de `mobile-pet-tracker/`.** Esta feature
  es harness y CI; cero código de aplicación. Si un e2e resulta rojo en CI por
  su propio contenido, eso es otra feature, no esta.
- **Optimización de CI**: ni caché de imágenes Docker, ni jobs en paralelo, ni
  partir `init.sh`. El objetivo es que los e2e corran, no que corran rápido.
- **Teardown de `docker compose` al final del job**: el runner de GitHub es
  efímero y se destruye entero. Un `docker compose down` sería ruido.
- **`docs/conventions.md` no se toca.** Su receta de worktree (§"Sesiones en
  paralelo") sigue siendo válida: `pnpm run db:migrate` a mano es ahora
  redundante con R6, pero no queda **falsa** — el comando es idempotente y es el
  mismo. Un cambio ahí ampliaría el diff sin cerrar ningún criterio.
- **La rama condicional por `$CI`** que se llegó a plantear: descartada en
  [[design]] §D3. El fallo es duro siempre.

## Riesgo declarado: `.env.example` y su candado de longitud

Las tres suites `aws-real-*` se saltan, pero las 26 restantes correrán por
primera vez contra un `.env` recién copiado de `.env.example` en un runner
limpio. Si alguna falla por una clave ausente o vacía en `.env.example`
(candidata evidente: `RESET_LINK_HOST=`, que hoy está vacía), la corrección
correcta es **hacer suficiente `.env.example`**, y por eso se declara como
fichero afectado *condicional* en [[design]] §Archivos.

**Trampa que ya ha parado el trabajo en este repo**: `env-drift.test.mjs`
(último `describe`, R11 de #23) afirma `assert.equal(keys.length, 24)` sobre las
claves de `.env.example`. **Cualquier clave nueva en `.env.example` pone ese
test en rojo** y hay que actualizar el 24 en el **mismo commit**. Es la misma
forma que el candado de longitud del catálogo de i18n. Si se toca
`.env.example`, se toca también ese número, o el gate miente en la otra
dirección.

## Verificación

- **Comando dirigido durante la implementación** (no `./init.sh`: el Postgres y
  el LocalStack de Docker están compartidos entre los dos worktrees y una
  corrida simultánea produce rojos falsos — `docs/conventions.md` §Sesiones en
  paralelo):

  ```
  node --test init-e2e-gate.test.mjs
  ```

  Antes de lanzar cualquier gate completo, comprobar que no hay otro en marcha:

  ```
  pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep
  ```

- **Gate completo** (lo corre el reviewer, con la infra arriba):
  `docker compose up -d` y después `./init.sh`, **medido sin tubería**. Delta
  contra `48e4130d`: ninguna suite pasa de verde a roja, ningún `it(` existente
  desaparece ni cambia de nombre, y cada R-id nuevo aporta su `describe` con su
  id en el título.
- C8 de `CHECKPOINTS.md` no aplica: esta feature no toca `mobile-pet-tracker/`.

## Gates humanos no delegables

Los dos se ejecutan **sobre el PR de esta feature** y **no** los puede cerrar el
reviewer: el criterio 2 exige explícitamente un rojo real observado, no una
inspección del YAML.

### G1 — el CI verde ejecuta los e2e (criterio de aceptación 1)

1. Abrir el PR de `feature/96-harness-e2e-nunca-corre-en-ci` contra `main` y
   esperar al job `verify`.
2. En el log, confirmar que aparece la sección `→ Tests e2e...` de `init.sh`
   **y** el resumen de jest con su línea `Test Suites: …`.
3. Comprobar la igualdad de §"Cómo se mide el criterio 1": suites ejecutadas
   distinto de cero e igual a (ficheros `*.e2e-spec.ts`) − (ficheros
   `aws-real-*.e2e-spec.ts`) en el commit del PR. Sobre `48e4130d` eso es
   26 de 29; sobre el commit del PR, recontar, no dar el 26 por bueno.
4. Confirmar que el job termina en verde y anotar la URL de la corrida en
   `progress/impl_harness-e2e-nunca-corre-en-ci.md`.

Si el job sale rojo **por el flake de móvil** (`add-pet` foto o `alerts` `#78
R4`) y no por un e2e, relanzar el job: es la feature `pending`
`mobile-add-pet-photo-test-flake`, no un fallo de esta. Anotarlo igualmente.

### G2 — un e2e rojo pone el PR en rojo (criterio de aceptación 2)

Demostración con un rojo **deliberado**, nunca por inspección del YAML:

1. Con G1 ya verde, crear desde la rama de la feature una rama de prueba:
   `git checkout -b test/96-ci-red-probe`.
2. Romper **un solo** e2e que no dependa de LocalStack, para que el rojo sea
   inequívoco: en `backend-pet-tracker/test/app.e2e-spec.ts`, cambiar el
   `.expect(401)` del único `it` por `.expect(418)`. Commit:
   `test(ci): probe deliberado de rojo e2e (no mergear)`.
3. `git push -u origin test/96-ci-red-probe` y abrir un PR **en borrador**
   contra `main`.
4. Observar y anotar **las tres cosas**:
   - el check del PR queda en **rojo**;
   - el paso que falla es `Harness verification (init.sh)`, y el log muestra el
     fallo **dentro de la sección `→ Tests e2e...`**;
   - la línea del fallo nombra `app.e2e-spec.ts` y el `expected 418`. **Esto es
     lo que distingue el probe del flake de móvil**: si el rojo viene de
     `add-pet` o de `alerts`, el probe no ha demostrado nada — relanzar.
5. Cerrar el PR **sin mergear**, borrar la rama local y remota.
6. Registrar en `progress/impl_harness-e2e-nunca-corre-en-ci.md` la URL de la
   corrida roja, la línea del fallo, y la URL de la corrida verde de G1.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
