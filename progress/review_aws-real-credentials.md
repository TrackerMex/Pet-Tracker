# review: aws-real-credentials (#19)

Fecha: 2026-08-09
Rama: `feature/19-aws-real-credentials`
Commits revisados: `d884dad` (implementación), `f3cef58` (trazabilidad)
Base de comparación: `origin/main`
Implementador: Codex CLI (reporte en `progress/impl_aws-real-credentials.md`)

**Veredicto: APROBADO** — con 2 condiciones de cierre que **no puede resolver
Codex**: son del humano (R11 corrida real, R12 registro de esa corrida). Nada
que corregir en el código.

---

## Resumen ejecutivo

R1–R10 están implementados y verificados por mí de forma independiente, con
infraestructura real levantada. `./init.sh` termina en **exit 0** con los e2e
**ejecutados de verdad** (no saltados): 119 suites / 869 tests unitarios y
13 suites / 181 tests e2e en verde.

El criterio más importante de la feature — R2, "modo local idéntico al actual"
— quedó verificado contra LocalStack real: `test/localstack-provisioning.e2e-spec.ts`
pasa 10/10 **sin haber sido modificado**, y `pnpm provision:local` provisiona
los recursos con el código refactorizado (exit 0).

R11 y R12 quedan parcialmente abiertos por diseño: la corrida contra la cuenta
AWS real es del humano, y yo tenía instrucción expresa de no ejecutarla.

---

## Verificación R-id por R-id

### R1 — `AWS_MODE` exact-match, default seguro `local` — CUMPLE

`backend-pet-tracker/src/aws/aws-clients.ts:41-43`

```ts
function resolveAwsMode(raw: string | undefined): AwsMode {
  return (raw ?? '').trim().toLowerCase() === 'aws' ? 'aws' : 'local';
}
```

Comparación de igualdad exacta, no `includes` ni `startsWith`. El default es la
rama `else`, así que **cualquier** valor no reconocido cae a `local`: un typo no
puede dirigir tráfico a la cuenta real. Se aplica en los dos resolvers
(`aws-clients.ts:56` y `aws-clients.ts:81`).

Test: `src/aws/aws-mode.spec.ts:35-57`, tabla que cubre `undefined`, `''`,
`'  '`, `'local'`, `'LOCAL'`, `'production'` → `local`; `'aws'`, `'AWS'`,
`' aws '` → `aws`, y comprueba **ambos** resolvers en cada caso.

Nota sobre `'AWS '`: resuelve a `aws`. Es lo que R1 exige literalmente
("tras `.trim().toLowerCase()`, es exactamente `aws`"), no un defecto.

### R2 — modo local idéntico al actual — CUMPLE (verificado con infra real)

`aws-clients.ts:105-112` devuelve exactamente las tres claves
`endpoint` / `region` / `credentials`.

Los tres archivos que R2 exige intactos **no aparecen** en
`git diff --name-only origin/main..HEAD`:

```
.env.example
backend-pet-tracker/src/aws/aws-clients.ts
backend-pet-tracker/src/aws/aws-mode-docs.spec.ts
backend-pet-tracker/src/aws/aws-mode.spec.ts
backend-pet-tracker/src/aws/run-provisioning.spec.ts
backend-pet-tracker/src/aws/run-provisioning.ts
backend-pet-tracker/test/aws-real-smoke.e2e-spec.ts
docs/conventions.md
docs/verification.md
feature_list.json
progress/current.md
progress/impl_aws-real-credentials.md
specs/aws-real-credentials/{design,requirements,tasks,traceability}.md
```

`aws-clients.spec.ts`, `aws-env-config.spec.ts` y `aws.module.spec.ts`: ausentes
de la lista ⇒ sin modificar, y verdes dentro de las 119 suites.

Verificación de comportamiento (no solo de tests unitarios):

```
$ pnpm run provision:local
PROVISION_EXIT=0

$ pnpm run test:e2e -- --runInBand localstack-provisioning
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
LS_E2E_EXIT=0
```

Test: `src/aws/aws-mode.spec.ts:59-85` (asserta `Object.keys(options).sort()`,
que detecta claves de más y de menos).

### R3 — modo aws sin endpoint custom — CUMPLE

`aws-clients.ts:101-103`: la rama `aws` retorna `{}` o `{ region }`; nunca
incluye `endpoint`. Test `aws-mode.spec.ts:87-100` construye los 4 clientes y
asserta `client.config.endpoint` `toBeUndefined()` en cada uno.

### R4 — modo aws sin `credentials` explícitas — CUMPLE

La clave está **ausente**, no presente con valor vacío: `aws-clients.ts:102`
devuelve objetos literales que no la contienen. Test `aws-mode.spec.ts:102-108`
usa `expect('credentials' in options).toBe(false)`, que es la aserción correcta
(distingue ausente de `undefined`).

### R5 — `region` solo si tiene valor — CUMPLE

`aws-clients.ts:102`: `config.region === '' ? {} : { region: config.region }`.
Nunca se pasa `region: ''`. Test `aws-mode.spec.ts:110-129` cubre la región con
valor y las dos formas de vacío (`undefined` y `''`) con
`expect('region' in options).toBe(false)`.

### R6 — `forcePathStyle` solo en local — CUMPLE

`aws-clients.ts:123-130`: el spread condicional
`...(config.mode === 'local' ? { forcePathStyle: true } : {})` deja la opción
fuera del objeto en modo `aws`. Test `aws-mode.spec.ts:131-147` asserta `true`
en local y `false` (default del SDK) en aws.

### R7 — `MissingAwsEndpointError` solo en local — CUMPLE

`aws-clients.ts:60-63`: `assertEndpoint` se llama únicamente en la rama `local`;
en `aws` se usa `env.AWS_ENDPOINT_URL ?? ''`. Test `aws-mode.spec.ts:149-162`.

Decisión D5 respetada: `resolveAwsConfigFromConfigService` (`:77-87`) **no**
gana `assertEndpoint`.

### R8 — `runProvisioning` aborta antes de construir clientes — CUMPLE

Orden real verificado en `backend-pet-tracker/src/aws/run-provisioning.ts`:

```
:33  config = resolveAwsConfigFromEnv(env)   <- solo lee env, sin red
:39  if (config.mode === 'aws') {
:40    logger.error('AWS_MODE=aws no está permitido en el provisioning local');
:41    return 1;
:42  }
:44  const clients: AwsClientBundle = { sqs: createSqsClient(config), ... }
```

La guarda está en las líneas 39-42, **antes** del bloque de construcción de la
línea 44. No hay ninguna llamada de red entre medias: `resolveAwsConfigFromEnv`
es lectura pura de `process.env`. Mensaje contiene `AWS_MODE`, exit code 1.

Test `src/aws/run-provisioning.spec.ts:21-45`: espía `createSqsClient` con un
`mockImplementation` que lanza, y asserta exit 1, `stringMatching(/AWS_MODE/)`
y `expect(createSqsClient).not.toHaveBeenCalled()`.

### R9 — guardas estáticos verdes y SIN relajar — CUMPLE

`src/aws/no-hardcoded-credentials.spec.ts` y `src/aws/no-real-aws-endpoint.spec.ts`
**no aparecen** en `git diff --name-only origin/main..HEAD` ⇒ no fueron tocados.
Ambos verdes dentro de las 119 suites.

Revisé además que el código nuevo no introduce literales prohibidos: ni
`aws-clients.ts` ni `run-provisioning.ts` contienen región entrecomillada
(`/['"`](us|eu|ap|…)-[a-z]+-\d['"`]/`), `AKIA…`, ni `amazonaws.com`. En modo
`aws` el dominio lo construye el SDK en runtime, tal como anticipaba la spec.
`test/aws-real-smoke.e2e-spec.ts` queda fuera del ámbito escaneado (no está en
`src/aws/` ni en `scripts/`) y de todos modos no contiene literales prohibidos.

### R10 — `AWS_MODE` documentada en los dos sitios — CUMPLE

- `.env.example`: línea `AWS_MODE=local` con bloque de comentario explicativo.
- `docs/conventions.md:228`: fila `| `AWS_MODE` | …` en la tabla "Variables de
  entorno", con el mismo formato que el resto.

Test: `src/aws/aws-mode-docs.spec.ts:6-24` lee ambos archivos desde el repo real
y asserta `/^AWS_MODE=local$/m` y `/^\| `AWS_MODE` \|/m`.

### R11 — suite de humo — CUMPLE EN MECANISMO / PENDIENTE LA CORRIDA REAL

Lo verificable sin tocar AWS, verificado por mí:

**(a) Se salta sola cuando `AWS_MODE` no es `aws`** —
`test/aws-real-smoke.e2e-spec.ts:10,20`:
`(runSmoke ? describe : describe.skip)`. Ejecutado:

```
$ pnpm run test:e2e -- --runInBand test/aws-real-smoke.e2e-spec.ts
Test Suites: 1 skipped, 0 of 1 total
Tests:       2 skipped, 2 total
SMOKE_LOCAL_EXIT=0
```

Sin red, exit 0.

**(b) No rompe `./init.sh` ni CI** — en la corrida completa con infra arriba, el
bloque e2e reporta `1 skipped, 13 passed, 13 of 14 total` y `./init.sh` termina
en exit 0.

**(c) Guardarraíl de `AWS_ACCESS_KEY_ID`** — implementado en `:12-18` y llamado
en `:34`, **antes** de `createSqsClient` en `:35`:

```ts
it('lista colas sin crear recursos', async () => {
  assertNoStaticAccessKey();                                   // :34 aborta aquí
  client = createSqsClient(resolveAwsConfigFromEnv(process.env)); // :35
```

El mensaje nombra `AWS_ACCESS_KEY_ID` y el primer test (`:29-31`) lo comprueba
con `expect(assertNoStaticAccessKey).not.toThrow()`. La aserción falla antes de
cualquier construcción de cliente, así que el guardarraíl no puede producir
tráfico.

**Pendiente (del humano, no de Codex):** la corrida con `AWS_MODE=aws` y sesión
`aws login`. No la ejecuté por instrucción expresa.

### R12 — documentación del procedimiento + registro de la corrida — PARCIAL

Cumple la primera mitad: `docs/verification.md:71-85` añade la sección
"Feature 19 — aws-real-credentials" con el comando exacto, el requisito de
comentar `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` en el `.env` raíz y el
resultado esperado. Test `aws-mode-docs.spec.ts:26-35`.

**No cumple la segunda mitad**, y no puede cumplirla Codex: R12 exige "dejar
registrada en `progress/impl_aws-real-credentials.md` la corrida real contra la
cuenta (con el output redactado)". El reporte declara honestamente
(`progress/impl_aws-real-credentials.md:43-44`) que no se ejecutó por
instrucción expresa. Esa línea la cierra el humano tras correr la prueba.

---

## Fuera de alcance — todo respetado

Verificado con `git diff --name-only origin/main..HEAD`:

- [x] `backend-pet-tracker/src/aws/provisioning.ts` — **no aparece en el diff**, ni una línea
- [x] `scripts/provision-local.ts` — no aparece en el diff
- [x] Sin CDK ni CloudFormation — no hay archivos de infra nuevos
- [x] `aws-clients.spec.ts`, `aws-env-config.spec.ts`, `aws.module.spec.ts` — sin modificar (exigido por R2)
- [x] `no-hardcoded-credentials.spec.ts`, `no-real-aws-endpoint.spec.ts` — sin modificar (exigido por R9)
- [x] Sin validación de esquema de entorno añadida
- [x] `resolveAwsConfigFromConfigService` sigue sin `assertEndpoint` (D5)
- [x] Ningún consumidor migrado: `aws.module.ts`, readers Dynamo, adapter S3 y
      workers siguen recibiendo los mismos clientes por los mismos tokens
      (firma de los 4 factories intacta: `(config: AwsRuntimeConfig)`)

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (`grep -c` sobre `feature_list.json` = 1, línea 317, id 19)
- [x] `feature_list.json` movió #19 `pending` → `in_progress`; **no** se marcó `done`
- [x] `progress/current.md` describe la sesión activa
- [ ] Observación menor: `progress/current.md:33` dice que Codex escribiría
      `progress/impl_19.md`, pero el archivo real es
      `progress/impl_aws-real-credentials.md`. Deriva documental, no bloqueante.

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de `infrastructure` — esta feature no toca `domain`
- [x] Repositorios/contratos en `domain` intactos
- [x] `application` sin cambios; sigue dependiendo de interfaces
- [x] `infrastructure` sin lógica de negocio: `src/aws/` solo resuelve
      configuración y construye clientes SDK. `resolveAwsClientOptions` es una
      función pura sin efectos.

## Checklist C4 — TDD

- [x] Cada R1–R12 tiene al menos un test que lo nombra en el `describe`:
      R1–R7 en `aws-mode.spec.ts`, R8 en `run-provisioning.spec.ts`,
      R9 vía `no-hardcoded-credentials.spec.ts::R3` +
      `no-real-aws-endpoint.spec.ts::R15` (preexistentes),
      R10/R12 en `aws-mode-docs.spec.ts`, R11 en `aws-real-smoke.e2e-spec.ts`.
- [ ] **Historial test-primero: NO se cumple.** `d884dad` es un único commit con
      implementación + los 3 archivos de test + docs juntos (10 archivos, +387).
      No hay commit de test rojo previo. **No bloqueante** en este caso: la
      feature la implementó Codex CLI fuera del flujo de subagentes, y
      reescribir la historia no mejora el código. Queda anotado para que el
      próximo handoff a Codex incluya la granularidad de commits en el prompt.

## Checklist C5 — Trazabilidad

- [x] `specs/aws-real-credentials/traceability.md` **sin ninguna fila "pendiente"**:
      las 12 filas tienen test real y hash de commit
- [x] Cada requisito tiene su test y su commit registrados
- [x] Formato de commit correcto: `feat(aws-real-credentials): use AWS credential chain (R1-R12)`
- [ ] Observación menor: el frontmatter de `traceability.md` sigue en
      `status: draft` (heredado de la plantilla). No es un gate definido.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla `[X] Aprobado por humano (fecha: 2026-08-09)` marcada
- [x] Ningún requisito modificado después del gate: `requirements.md` se aprobó
      en `f8be219` y **no** aparece entre los archivos de `d884dad`

## Checklist C7 — Sin código huérfano

- [x] La función privada `credentials()` (antes L75), reemplazada por
      `resolveAwsClientOptions`, fue eliminada — no quedó "por si acaso"
- [x] No quedan `.spec` de código eliminado
- [x] Ningún módulo/componente anterior queda sin importadores

---

## Output de `./init.sh` (corrida propia, con infra levantada)

Primera corrida: **falló**. LocalStack acababa de arrancar sin recursos y los
e2e reventaron con `NoSuchBucket` (82 tests). Causa ambiental, no del código:
tras `pnpm run provision:local` (exit 0) la corrida quedó limpia. Se documenta
por transparencia.

```
$ docker compose up -d
 Container pet-tracker-postgres    Started
 Container pet-tracker-localstack  Started
NAME                     STATUS                    PORTS
pet-tracker-localstack   Up (healthy)   0.0.0.0:4566->4566/tcp
pet-tracker-postgres     Up (healthy)   0.0.0.0:5432->5432/tcp

$ pnpm -C backend-pet-tracker run provision:local
PROVISION_EXIT=0

$ ./init.sh
→ Verificando entorno...
→ Verificando variables de entorno...
→ Instalando dependencias...
→ Verificando coherencia del harness...
→ Build...
→ Ejecutando tests...
Test Suites: 119 passed, 119 total
Tests:       869 passed, 869 total

→ Tests e2e...
Test Suites: 1 skipped, 13 passed, 13 of 14 total
Tests:       2 skipped, 181 passed, 183 total

→ Lint...
→ Typecheck...
✅ Todo verde. Listo para trabajar.
  Features: 14/20 completadas | 5 pendientes

INIT_EXIT=0
```

La suite saltada es `test/aws-real-smoke.e2e-spec.ts` (R11), tal como exige la
spec cuando `AWS_MODE` no es `aws`.

Verificaciones adicionales ejecutadas por mí:

```
$ pnpm run test:e2e -- --runInBand localstack-provisioning
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total          <- R2, archivo sin modificar

$ pnpm run test:e2e -- --runInBand test/aws-real-smoke.e2e-spec.ts
Test Suites: 1 skipped, 0 of 1 total
Tests:       2 skipped, 2 total           <- R11 auto-skip, sin red
```

---

## Verificaciones NO realizadas (declaradas explícitamente)

1. **R11 contra la cuenta AWS real.** No ejecutada, por instrucción expresa. El
   mecanismo (skip, guardarraíl, orden antes de red) sí quedó verificado.
2. **Guardarraíl `AWS_ACCESS_KEY_ID` en ejecución.** Verificado por lectura de
   código (orden `:34` antes de `:35`), no ejecutado: correrlo con
   `AWS_MODE=aws` habría implicado una llamada real si mi suposición sobre el
   contenido del `.env` raíz hubiera sido incorrecta. Preferí no arriesgar
   tráfico contra la cuenta. La lectura del `.env` para confirmarlo la bloqueó
   el clasificador de secretos, y no insistí.

---

## Condiciones para marcar la feature `done`

Ninguna es corregible por Codex. Ambas son del humano:

1. Correr la prueba de humo siguiendo `docs/verification.md` §"Feature 19"
   (R11): `aws login`, comentar el par dummy en el `.env` raíz, ejecutar el
   comando documentado y confirmar 2 tests verdes.
2. Pegar el output redactado (sin ARNs de cuenta ni credenciales) en
   `progress/impl_aws-real-credentials.md`, que es lo que R12 exige para cerrar.

Hasta entonces R11 y R12 están cumplidos solo en su parte automatizable.

## Observaciones (ninguna bloqueante)

1. **C4, granularidad de commits**: todo en `d884dad`. Añadir la exigencia de
   commits test-primero al prompt de handoff a Codex.
2. **Cobertura R1**: la tabla no incluye un typo cercano tipo `'awss'`. La
   implementación es exact-match, así que el caso está cubierto por
   construcción y por la fila `'production'`; añadirlo sería barato pero no es
   necesario.
3. **R5 y espacios**: `region` con solo espacios (`'  '`) se pasaría tal cual.
   R5 habla de "ausente o vacía", así que está dentro de contrato; se menciona
   por si el humano quiere endurecerlo en la feature #20.
4. `traceability.md` sigue con `status: draft` en el frontmatter.
5. `progress/current.md:33` apunta a `progress/impl_19.md`, archivo que no
   existe con ese nombre.
