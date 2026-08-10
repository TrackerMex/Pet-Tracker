---
feature: "aws-mode-endpoint-guard"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[aws-mode-endpoint-guard]]

> Ver [[requirements]] y [[../../docs/architecture|architecture]].
>
> Capa: **infrastructure**. `src/aws/` es infraestructura compartida (análoga a
> `src/db/`), sin domain ni application propios. `domain` y `application` no se
> enteran de este cambio: siguen sin saber que existe AWS (C3).

## Decisiones técnicas

- **D1 — El error se llama `UnexpectedAwsEndpointError` y se exporta desde
  `backend-pet-tracker/src/aws/aws-clients.ts`.** Nombre fijado, no orientativo
  (el criterio de aceptación lo daba como "ej."). Vive en el mismo archivo y con
  la misma forma que `MissingAwsEndpointError` (L22-L32 hoy): clase que extiende
  `Error`, mensaje construido en el constructor sin parámetros, y
  `this.name = 'UnexpectedAwsEndpointError'` como última línea del constructor.
  Es la convención de errores nombrados del repo aplicada a infraestructura
  (`docs/conventions.md` §Manejo de errores reserva `domain/errors/` para los
  errores de dominio; este no lo es, igual que `MissingAwsEndpointError`).
  Sirve a R1.

- **D2 — Texto exacto del mensaje.** Codex lo copia literal:

  ```
  AWS_ENDPOINT_URL está definida (valor no vacío) y AWS_MODE=aws. El AWS SDK v3
  lee AWS_ENDPOINT_URL de process.env por su cuenta, así que los clientes
  hablarían con LocalStack creyendo hablar con AWS real: se aborta antes de
  construir ningún cliente. Comenta AWS_ENDPOINT_URL en el .env raíz para el
  modo aws, o vuelve a AWS_MODE=local (ver docs/verification.md, feature 21).
  ```

  Contiene las cuatro subcadenas que exige R2 (`AWS_ENDPOINT_URL`, `AWS_MODE`,
  `process.env`, `.env`). **Los tests comprueban subcadenas con `toMatch`, nunca
  el string completo**, para que un retoque de redacción no rompa la suite.
  Restricciones que el texto ya respeta y que Codex no debe romper: ni el
  literal del dominio público de AWS (lo vigila
  `src/aws/no-real-aws-endpoint.spec.ts`) ni una región entrecomillada tipo
  `'us-east-1'` (lo vigila `src/aws/no-hardcoded-credentials.spec.ts` con su
  constante `HARDCODED_REGION_PATTERN`). Sirve a R2.

- **D3 — La guarda vive dentro de los dos resolvers, nunca en
  `resolveAwsClientOptions` ni en los factories.** Helper privado, simétrico a
  `assertEndpoint` (L34-L39 hoy) y colocado justo debajo de él:

  ```ts
  function assertNoEndpoint(endpoint: string | undefined): string {
    if (endpoint && endpoint.trim() !== '') {
      throw new UnexpectedAwsEndpointError();
    }
    return '';
  }
  ```

  No se exporta (igual que `assertEndpoint`): la superficie testeable son los
  dos resolvers, no el helper. Devuelve `''` para que el campo `endpoint` de
  `AwsRuntimeConfig` siga siendo `string` requerido y ningún consumidor cambie
  (R3).

  **Por qué no en `resolveAwsClientOptions` ni en los factories**: los
  tests de #19 en `src/aws/aws-mode.spec.ts` construyen a propósito
  `buildAwsConfig()` = `{ mode: 'aws', endpoint: 'http://localhost:4566', … }` y
  se lo pasan directo a `resolveAwsClientOptions` y a los cuatro factories (R3,
  R4, R5, R6 de #19). Una guarda ahí abajo los pondría en rojo y obligaría a
  editar un archivo que R4 declara intocable. Además, poner la guarda en el
  resolver es el arreglo de raíz: los dos resolvers son el único camino por el
  que la configuración entra al sistema en producción (`aws.module.ts`,
  `run-provisioning.ts`, los tres e2e). Sirve a R1 y R5.

- **D4 — Forma exacta de los dos resolvers después del cambio.** Es la única
  modificación funcional de la feature:

  ```ts
  export function resolveAwsConfigFromEnv(
    env: NodeJS.ProcessEnv,
  ): AwsRuntimeConfig {
    const mode = resolveAwsMode(env.AWS_MODE);

    return {
      mode,
      endpoint:
        mode === 'local'
          ? assertEndpoint(env.AWS_ENDPOINT_URL)
          : assertNoEndpoint(env.AWS_ENDPOINT_URL),
      region: env.AWS_REGION ?? '',
      accessKeyId: env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? '',
    };
  }

  export function resolveAwsConfigFromConfigService(
    config: ConfigService,
  ): AwsRuntimeConfig {
    const mode = resolveAwsMode(config.get<string>('AWS_MODE'));
    const endpoint = config.get<string>('AWS_ENDPOINT_URL') ?? '';

    return {
      mode,
      endpoint: mode === 'aws' ? assertNoEndpoint(endpoint) : endpoint,
      region: config.get<string>('AWS_REGION') ?? '',
      accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID') ?? '',
      secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
    };
  }
  ```

  Nótese la asimetría deliberada del segundo: en modo `local` **no** llama a
  `assertEndpoint` (decisión D5 de la spec de #19, que sigue vigente — añadirla
  cambiaría el arranque de `AwsModule` en escenarios que nadie pidió). Los
  comentarios JSDoc de las dos funciones (L45-L52 y L70-L76 hoy) se actualizan
  para nombrar la guarda nueva. Sirve a R1, R3, R4, R5.

- **D5 — La vía `ConfigService` es un proxy fiable de `process.env`, y basta.**
  Comprobado en `@nestjs/config@4.0.4`
  (`node_modules/@nestjs/config/dist/config.service.js`, método `get`): resuelve
  por orden `internalConfig` → `validatedEnv` → `process.env`, y
  `skipProcessEnv` es `false` por defecto; `AppConfigModule.forRoot`
  (`src/config/config.module.ts`) no lo activa ni usa `validationSchema`. Así
  que si `AWS_ENDPOINT_URL` está en `process.env` —que es exactamente lo que le
  importa al SDK—, `config.get('AWS_ENDPOINT_URL')` la ve. **Por eso el guard de
  la vía ConfigService NO lee `process.env` directamente**: sería violar
  `docs/conventions.md` (dentro del runtime Nest solo se lee configuración por
  `ConfigService`) sin ganar cobertura real. Límite conocido y aceptado: si
  algún día alguien activa `skipProcessEnv` o `ignoreEnvVars`, esta vía dejaría
  de ver la variable; en ese momento habría que revisar esta decisión. Sirve a
  R5.

- **D6 — Documentación: una sección nueva y una corrección quirúrgica.**
  `docs/verification.md` gana, después del bloque de la feature 20 y antes de
  `## Notas para el implementer`:

  ````markdown
  ### Feature 21 — aws-mode-endpoint-guard

  La guarda es automática y vive en `backend-pet-tracker/src/aws/aws-clients.ts`:
  con `AWS_MODE=aws` y `AWS_ENDPOINT_URL` definida, resolver la configuración
  lanza `UnexpectedAwsEndpointError` antes de construir ningún cliente, así que
  ninguna suite puede volver a pasar en verde contra LocalStack creyendo hablar
  con AWS real. Es simétrica a `MissingAwsEndpointError`, que cubre el caso
  inverso en modo `local`.

  Para comprobarla a mano, desde la raíz y con `AWS_ENDPOINT_URL` sin comentar
  en el `.env`:

  ```bash
  AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/aws-real-ingest.e2e-spec.ts
  ```

  Resultado esperado: la suite **falla** nombrando `AWS_ENDPOINT_URL`, sin
  ejecutar ninguna llamada remota. No hay que apagar LocalStack para
  distinguirlo.

  Lo que la guarda **no** cubre: la CLI de CDK (`cdk bootstrap`, `cdk deploy`)
  no pasa por `aws-clients.ts` y lee `AWS_ENDPOINT_URL` del entorno por su
  cuenta, así que el paso R18 de la feature 20 sigue exigiendo comentar la
  variable a mano.
  ````

  Y el bloque **R21** de la sección "Feature 20 — aws-cdk-dev-stack" (hoy
  L166-L176, el párrafo que empieza por `**Verde no basta como evidencia.**`) se
  reescribe para que deje de presentar el procedimiento manual como única red:
  mantiene los dos métodos de comprobación (mirar el `QueueUrl`, apagar
  LocalStack) como verificación opcional, y antepone que desde la feature 21 la
  guarda automática aborta la corrida si `AWS_ENDPOINT_URL` sigue puesta. **No
  se borra** la instrucción de comentar las tres variables del paso R18: sigue
  haciendo falta para el CDK. Sirve a R7.

  `docs/conventions.md` **no se toca**: el gate humano descartó el requisito que
  lo proponía (ver el aviso "No hay R8" en [[requirements]]).

- **D7 — Los tests de documentación siguen el precedente del repo.** Nuevo
  archivo `src/aws/aws-endpoint-guard-docs.spec.ts`, calcado de
  `src/aws/aws-mode-docs.spec.ts` y `src/aws/cdk-dev-stack-docs.spec.ts`:
  `const REPOSITORY_ROOT = join(__dirname, '..', '..', '..');` +
  `readFileSync(..., 'utf-8')` + `expect(texto).toContain(...)`. Al ser
  `.spec.ts`, los guardas estáticos de `no-hardcoded-credentials.spec.ts` y
  `no-real-aws-endpoint.spec.ts` lo ignoran. Sirve a R7.

- **D8 — El e2e de ingest solo gana un test, no un helper.** `assertNoStaticAccessKey`
  existe en `test/aws-real-ingest.e2e-spec.ts` (L42-L48) porque las credenciales
  **no** tienen guarda en el código de producción. El endpoint sí la tendrá, así
  que duplicarla en el test sería código muerto por partida doble. El cambio es:

  1. En el `beforeAll` (L113-L120) no hace falta reordenar nada: la llamada
     existente `resolveAwsConfigFromEnv(process.env)` ya lanza
     `UnexpectedAwsEndpointError` **antes** de las tres líneas que construyen
     los clientes, y Jest reporta el fallo del `beforeAll` con ese mensaje en
     los tres tests de la suite. Eso es lo que satisface R6.
  2. Se añade, como **primer** `it` del `describe`, el test que nombra R6 —
     mismo patrón que `test/aws-real-smoke.e2e-spec.ts` L29-L31 con
     `assertNoStaticAccessKey`:

     ```ts
     it('R6: aborta si AWS_ENDPOINT_URL sigue definida', () => {
       expect(() => resolveAwsConfigFromEnv(process.env)).not.toThrow();
     });
     ```

  El `describe` sigue siendo `(runAwsIngest ? describe : describe.skip)('R21: …')`
  — ese `R21` es el R-id de la feature #20 y **no se toca**; el R-id de esta
  feature vive en el `it`. Sirve a R6.

- **D9 — Los R-ids son por feature; el archivo desambigua.** `R1` de esta spec
  no es `R1` de #19. Precedente en el repo: `cdk-dev-stack-docs.spec.ts` usa
  `R3`/`R5`/`R6`/`R15` de #20 mientras `aws-mode.spec.ts` usa `R1`…`R7` de #19.
  Por eso los tests nuevos van en **archivos nuevos** (`aws-endpoint-guard.spec.ts`,
  `aws-endpoint-guard-docs.spec.ts`) y `traceability.md` cita siempre
  `archivo::describe`. Sirve a C4/C5.

- **D10 — `aws-mode.spec.ts` se adapta al contrato nuevo, con dos cambios y
  nada más.** (Añadido en la enmienda de R4 del 2026-08-10.) Cinco de sus tests
  pasan `{ AWS_MODE: 'aws', AWS_ENDPOINT_URL: ENDPOINT }` a los resolvers, que
  con la guarda de R1 pasa a ser una combinación ilegal. En los cinco el
  endpoint es **incidental**: prueban resolución de modo y de región, no el
  endpoint — el fixture lo arrastraba por comodidad. Los dos cambios:

  1. `describe('R1: AWS_MODE resuelve el modo con default local')` (L47-50). El
     `it.each` mezcla casos `local` y `aws` en una tabla; los `local`
     **necesitan** el endpoint o salta `MissingAwsEndpointError`. El env pasa a
     depender del modo esperado:

     ```ts
     const env = {
       AWS_MODE: rawMode,
       AWS_ENDPOINT_URL: expectedMode === 'local' ? ENDPOINT : undefined,
     };
     ```

  2. `describe('R5: modo aws pasa region solo si tiene valor')`, el `it.each` de
     L119-128: se borra la línea `AWS_ENDPOINT_URL: ENDPOINT,` del objeto que
     recibe `resolveAwsConfigFromEnv`. Modo `aws` sin endpoint no lanza (lo fija
     R7 de #19), y el test sigue probando lo suyo: que `region` se omite.

  Prohibido todo lo demás en ese archivo: no se añade, borra ni renombra ningún
  `describe`/`it`, no se debilita ninguna aserción, no se toca
  `buildAwsConfig()` — sus consumidores (`resolveAwsClientOptions` y los cuatro
  factories) siguen verdes sin cambios, que es lo que §D3 predijo bien. La
  cobertura que se pierde es la de "modo aws con endpoint", combinación que
  ahora está prohibida y cuya prueba es R1 de esta feature. Sirve a R4.

## Archivos afectados

Todo lo de `backend-pet-tracker/` es capa **infrastructure**; el resto es
documentación del harness.

| Archivo | Cambio | R-ids |
|---|---|---|
| `backend-pet-tracker/src/aws/aws-clients.ts` | **Modificar.** `UnexpectedAwsEndpointError` (exportada), `assertNoEndpoint` (privada), guarda en los dos resolvers, JSDoc actualizado | R1, R2, R3, R4, R5 |
| `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts` | **Nuevo.** Tests unitarios | R1, R2, R3, R4, R5 |
| `backend-pet-tracker/src/aws/aws-mode.spec.ts` | **Modificar.** Solo los dos cambios de D10; nada más | R4 |
| `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts` | **Modificar.** Un `it` nuevo (D8); ningún otro cambio | R6 |
| `backend-pet-tracker/src/aws/aws-endpoint-guard-docs.spec.ts` | **Nuevo.** Tests de documentación | R7 |
| `docs/verification.md` | **Modificar.** Sección "Feature 21" + reescritura del párrafo R21 de la feature 20 (D6) | R7 |
| `progress/impl_aws-mode-endpoint-guard.md` | **Nuevo.** Bitácora del implementer + corrida de `./init.sh` | R9 |
| `specs/aws-mode-endpoint-guard/traceability.md` | **Modificar.** Una fila por R-id tras cada commit | R9 |

**No se tocan** (si aparecen en el diff, el reviewer rechaza):
`src/aws/provisioning.ts`, `src/aws/run-provisioning.ts`, `src/aws/aws.module.ts`,
`src/aws/aws.constants.ts`, `src/aws/constants.ts`, `src/config/config.module.ts`,
`scripts/provision-local.ts`, `test/localstack-provisioning.e2e-spec.ts`,
`test/aws-real-smoke.e2e-spec.ts`, `test/fixtures/.env.aws-fixture`,
`src/aws/aws-clients.spec.ts`,
`src/aws/aws-env-config.spec.ts`, `src/aws/aws.module.spec.ts`,
`src/aws/aws-mode-docs.spec.ts`, `src/aws/no-hardcoded-credentials.spec.ts`,
`src/aws/no-real-aws-endpoint.spec.ts`, `.env.example`, `docs/conventions.md`,
`infra/`.

`.env.example` no cambia: `AWS_ENDPOINT_URL` ya está documentada ahí y sigue
siendo la configuración correcta del modo `local`, que es el default.

## Contrato de tests (qué prueba cada R-id)

| R-id | Archivo | `describe` / `it` |
|---|---|---|
| R1 | `src/aws/aws-endpoint-guard.spec.ts` | `describe('R1: modo aws con AWS_ENDPOINT_URL definida aborta')` |
| R2 | `src/aws/aws-endpoint-guard.spec.ts` | `describe('R2: el mensaje del error nombra la variable y la acción')` |
| R3 | `src/aws/aws-endpoint-guard.spec.ts` | `describe('R3: modo aws sin AWS_ENDPOINT_URL no cambia')` |
| R4 | `src/aws/aws-endpoint-guard.spec.ts` | `describe('R4: modo local intacto')` |
| R5 | `src/aws/aws-endpoint-guard.spec.ts` | `describe('R5: la guarda cubre las dos vías de resolución')` |
| R6 | `test/aws-real-ingest.e2e-spec.ts` | `it('R6: aborta si AWS_ENDPOINT_URL sigue definida')` |
| R7 | `src/aws/aws-endpoint-guard-docs.spec.ts` | `describe('R7: verification.md documenta la guarda')` |
| R9 | — | Sin test: lo verifica el reviewer sobre `git log --oneline`, `traceability.md`, `progress/impl_aws-mode-endpoint-guard.md` y `./init.sh` |

Pistas concretas para escribir los tests unitarios, para que no haya que
inventar nada:

- Mock de `ConfigService` (copiar el de `src/aws/aws-mode.spec.ts` L16-L20):
  `{ get: (key: string) => env[key] } as unknown as ConfigService`.
- R5 se escribe como `it.each` sobre las dos vías, con un array de dos
  funciones `(env: NodeJS.ProcessEnv) => AwsRuntimeConfig`: la segunda envuelve
  `resolveAwsConfigFromConfigService(buildConfigServiceMock(env))`.
- R3 comprueba las tres formas de "ausente": `undefined`, `''`, `'   '`.
- R4 comprueba que `resolveAwsConfigFromEnv({})` sigue lanzando
  `MissingAwsEndpointError` y que
  `resolveAwsConfigFromEnv({ AWS_ENDPOINT_URL: 'http://localhost:4566' }).endpoint`
  conserva su valor.
- Ninguno de estos tests necesita LocalStack, red, ni `AWS_MODE` en el entorno
  real: todos pasan el `env` como argumento.

## Alternativas descartadas

- **Borrar `process.env.AWS_ENDPOINT_URL` en modo `aws`** (`delete env.AWS_ENDPOINT_URL`
  antes de construir clientes): arregla el síntoma mutando el entorno global del
  proceso, con efecto lateral invisible sobre cualquier otro consumidor. Es
  exactamente la alternativa que #19 ya descartó para las credenciales (D8 de
  su design). Descartada.
- **Pasar `endpoint: undefined` explícito al SDK**: no sirve. El SDK v3 lee
  `AWS_ENDPOINT_URL` del entorno en su cadena de resolución de endpoint; pasar
  `undefined` es indistinguible de no pasar la clave, que es lo que ya hace #19
  y lo que falló.
- **Guarda en `resolveAwsClientOptions` o en los cuatro factories**: rompe
  `src/aws/aws-mode.spec.ts` sin ganar cobertura (D3), y llega tarde — el punto
  del requisito es abortar *antes* de construir ningún cliente.
- **Guarda solo en `resolveAwsConfigFromEnv`** (la vía por la que corren los
  e2e que fallaron): dejaría el runtime Nest —`AwsModule`, workers, readers—
  hablando con LocalStack en modo `aws`. El criterio de aceptación #4 exige
  explícitamente las dos vías.
- **Leer `process.env` también desde la vía `ConfigService`** (cinturón y
  tirantes): viola la regla de `docs/conventions.md` sobre no leer `process.env`
  dentro del runtime Nest, y no gana nada con la configuración actual de
  `@nestjs/config` (D5).
- **Un tercer valor de `AWS_MODE` (`aws-strict`)**: inventa configuración para
  un problema que es un bug. El modo `aws` debe ser seguro por definición.
- **Hacer que la suite falle también cuando `AWS_MODE` no llega al proceso**
  (el otro falso verde de #20, el de la sintaxis de PowerShell bajo Bash): es un
  problema distinto —la suite se auto-salta, no pasa en verde falso— y cambiar
  el `describe.skip` rompería CI y `./init.sh`, donde `AWS_MODE` nunca es `aws`.
  Fuera de alcance por decisión explícita.
