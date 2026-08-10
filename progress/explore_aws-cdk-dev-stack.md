# explore: aws-cdk-dev-stack

Fecha: 2026-08-10
Feature: #20 `aws-cdk-dev-stack` (`pending`, P2)
Autor: agente `explorer` (solo lectura — no se escribió código, no se creó
`infra/`, no se ejecutó `cdk` ni ninguna llamada de escritura contra AWS)

> Este documento es insumo para `spec_author`. No decide nada: presenta
> hallazgos, opciones y una recomendación razonada por decisión. Lo que de
> verdad no puedo decidir yo está al final, en "Preguntas para el humano".

---

## Resumen ejecutivo (lo que importa si solo lees 10 líneas)

1. **El nombre del bucket es un problema real pero pequeño.** Solo hay
   **un** literal duplicado en todo el repo (`test/media.e2e-spec.ts:185`),
   y ese archivo **ya importa `BUCKET_MEDIA`** en su línea 15. La solución
   más barata es una constante derivada por modo en `constants.ts` + un
   parámetro de sufijo en el stack.
2. **Hay un bug latente que el stack va a tapar sin querer y conviene que
   la spec lo haga explícito:** `provisioning.ts` **nunca crea la
   resource-policy de SQS** que EventBridge necesita en AWS real para
   entregar en `geofence-events`. En LocalStack Community funciona porque
   no hay enforcement de IAM. En AWS real, sin esa policy, la regla
   *falla en silencio*. CDK lo añade solo — pero eso debe ser un requisito
   verificado, no un accidente afortunado.
3. **`provisioning.ts` usa `PAY_PER_REQUEST`; la feature exige
   `PROVISIONED` 25/25.** El acceptance criterion dice "exactamente los
   recursos que hoy crea provisioning.ts" y a la vez fija un billing mode
   distinto. Es una divergencia deliberada que la spec tiene que declarar
   como tal, o el reviewer la marcará como incumplimiento.
4. **`infra/` quedaría 100 % fuera del gate.** `init.config.sh` cablea
   `pnpm -C backend-pet-tracker` en los cinco comandos, y CI corre
   *solo* `init.sh`. Lint, typecheck y tests de `infra/` no se ejecutarían
   nunca. Agujero que la spec debe cerrar.
5. **Las cifras del free tier de DynamoDB se confirman**, con matices
   importantes (por cuenta y región, no por tabla; solo clase Standard;
   backups aparte). Pero **la estructura misma del free tier cambió el
   2025-07-15** y no sé en qué plan está esta cuenta — eso sí es pregunta
   para el humano.

---

## D1 — El nombre del bucket S3

### Qué encontré

**La constante y su comentario**

`backend-pet-tracker/src/aws/constants.ts:34-36`:

```ts
// S3 — sufijo -local explícito: nunca se reutiliza este nombre contra un
// bucket de AWS real (design.md).
export const BUCKET_MEDIA = 'pet-tracker-media-local';
```

El comentario es una promesa hecha en la spec de #2
(`specs/localstack-provisioning/design.md`) y el acceptance criterion de
#20 ("los nombres de recursos se importan de `constants.ts`; grep de
literales duplicados en el stack da cero") **la contradice frontalmente**
si se importa `BUCKET_MEDIA` tal cual en el stack. No es un conflicto de
estilo: es un conflicto de contrato entre dos features.

**Todos los consumidores de `BUCKET_MEDIA` (barrido completo del repo)**

| Ruta | Línea | Uso |
|---|---|---|
| `backend-pet-tracker/src/aws/constants.ts` | 36 | definición |
| `backend-pet-tracker/src/aws/provisioning.ts` | 29, 237, 246 | import; `CreateBucketCommand`; `PutPublicAccessBlockCommand` |
| `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts` | 9, 23, 28 | import; `PutObjectCommand`; `GetObjectCommand` (presign de #6) |
| `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts` | 30, 227, 236 | import; `ListBuckets`; `GetPublicAccessBlock` |
| `backend-pet-tracker/test/media.e2e-spec.ts` | 15, 330, 345 | import; `GetPublicAccessBlock`; `GetBucketPolicy` |

Son **4 archivos consumidores** y todos importan la constante. Nadie
construye el nombre a mano ni lo compone por concatenación.

**El único literal duplicado del repo (en código)**

`backend-pet-tracker/test/media.e2e-spec.ts:185`:

```ts
expect(body.uploadUrl).toEqual(
  expect.stringContaining('pet-tracker-media-local'),
);
```

Ese mismo archivo ya tiene `import { BUCKET_MEDIA } from '@/aws/constants';`
en la línea 15 y lo usa correctamente en las líneas 330 y 345. La línea 185
es un descuido puntual: se arregla cambiando el literal por `BUCKET_MEDIA`,
una línea, sin tocar la lógica del test. **Esto hay que arreglarlo pase lo
que pase con la decisión de nombres** — si no, cualquier cambio de nombre de
bucket deja el e2e rojo por una razón que no tiene que ver con el bug.

Fuera de código, el literal aparece en documentación
(`docs/architecture.md:103`, `specs/pet-photos-s3/*`, `plans/*`, `STATUS.md`,
`progress/*`). Documentación histórica: no se toca, pero
`docs/architecture.md:103` sí conviene actualizarlo porque describe la tabla
de equivalencias local↔AWS y esa tabla es lo primero que lee cualquiera.

**¿El mismo problema afecta a otros nombres?** No, y por una razón técnica
concreta: **S3 es el único servicio de los cinco cuyo namespace de nombres
es global a todo AWS.** SQS, DynamoDB y EventBridge tienen namespace por
cuenta+región. Ni `positions-raw`, ni `positions`, ni `pet-tracker`
colisionan con nada de terceros. El único otro riesgo sería colisionar con
*otro entorno propio en la misma cuenta*, y eso es D3, no D1.

### Opciones

**A. Reusar `BUCKET_MEDIA` tal cual en el stack**
Cumple el criterio "cero literales" de forma trivial y es el menor diff.
Rompe: la promesa explícita de `constants.ts:34-35`; deja un bucket de AWS
real con sufijo `-local` (confuso a perpetuidad, y S3 no permite renombrar);
y apuesta a que `pet-tracker-media-local` esté libre globalmente — si está
tomado, `cdk deploy` falla con `BucketAlreadyExists` y el rollback es
molesto pero no destructivo. **Descartada por el nombre engañoso, no por el
riesgo técnico.**

**B. Constante derivada por modo, en `constants.ts`**
Convertir el valor en una función/constante que compone el nombre desde una
base compartida:

```ts
export const BUCKET_MEDIA_BASE = 'pet-tracker-media';
export const bucketMediaFor = (suffix: string) => `${BUCKET_MEDIA_BASE}-${suffix}`;
export const BUCKET_MEDIA = bucketMediaFor('local');   // runtime local
```

El stack importa `bucketMediaFor` (o `BUCKET_MEDIA_BASE`) y compone
`-dev-<accountId>`. Cero literales duplicados (la base vive en un solo
sitio), nombres distintos por entorno, y el runtime local no cambia ni un
byte — `BUCKET_MEDIA` sigue valiendo `pet-tracker-media-local`, así que
todos los tests actuales y `photo-storage.s3.adapter.ts` siguen verdes sin
tocarse. Coste: ~4 líneas en `constants.ts` y el fix de una línea en
`media.e2e-spec.ts:185`.
Efecto secundario que hay que aceptar: cuando el backend corra con
`AWS_MODE=aws` necesitará resolver *su* nombre de bucket (`-dev-...`), no el
`-local`. Eso es trabajo de una feature posterior (cablear el runtime contra
los recursos reales), **no de #20** — pero la spec debe decir explícitamente
que #20 no lo resuelve, para que nadie lo dé por hecho.

**C. Sufijo por variable de entorno (`ENV_SUFFIX=dev`)**
Igual que B pero el sufijo viene de env en vez de ser un argumento del
stack. Añade una variable más al `.env` raíz y un modo de fallo nuevo
(sufijo vacío → nombre colisiona con el de otro entorno). No compra nada
sobre B en esta fase, donde solo existe `dev`. **Descartada por YAGNI.**

**D. Nombre autogenerado por CloudFormation + CfnOutput**
No pasar `bucketName`; CDK genera `awscdkstack-mediabucket-<hash>`, único
por construcción, y el stack lo exporta como output. Es lo que AWS
recomienda por defecto (permite reemplazos sin conflictos de nombre).
Rompe: el nombre deja de ser conocido en tiempo de compilación, así que el
backend tendría que **descubrirlo en runtime** (leer el output del stack, o
un SSM parameter, o una env var rellenada a mano tras el deploy). Eso es
infraestructura de configuración que hoy no existe en el repo, y arrastra
consigo un mecanismo nuevo entero. Además, el criterio de aceptación pide
explícitamente que los nombres se importen de `constants.ts`, y un nombre
autogenerado no puede importarse de ahí. **Es la opción "más AWS-correcta" y
la más cara; no vale la pena para un entorno dev de una sola persona.**

**E. Sufijo con el account-id, sin sufijo de entorno**
`pet-tracker-media-<accountId>`. Único globalmente por construcción (el
account-id lo es), sin necesidad de un registro de entornos. Pero si algún
día hay `dev` y `prod` en la misma cuenta, colisionan — que es exactamente
el escenario de D3.

### Recomendación

**Opción B, componiendo base + entorno + account-id: `pet-tracker-media-dev-<accountId>`.**

Razones, en orden:

1. Es el diff más corto que satisface los tres constraints a la vez (cero
   literales duplicados, nombre no engañoso, unicidad global garantizada).
   El account-id lo resuelve CDK solo con `Stack.of(this).account` — no hay
   que hardcodearlo ni pasarlo por env.
2. **No toca el runtime local en absoluto.** `BUCKET_MEDIA` conserva su
   valor exacto, así que los 4 consumidores actuales y los e2e de LocalStack
   siguen funcionando sin cambios. Un cambio de infraestructura que no puede
   romper el camino que ya funciona es el cambio correcto.
3. El account-id elimina de raíz la clase de fallo "otro cliente de AWS ya
   tiene ese nombre", que es la que produce un `cdk deploy` fallido y
   difícil de diagnosticar. La probabilidad de que `pet-tracker-media-dev`
   a secas esté tomado no es despreciable: es un nombre genérico.
4. Deja la puerta abierta a D3 sin comprometerse: si mañana hay `prod`, el
   sufijo `dev`/`prod` ya está en el nombre.

Y por separado, **independiente de la decisión**: arreglar
`test/media.e2e-spec.ts:185` para que use `BUCKET_MEDIA` en vez del literal.
Es un requisito de una línea que la spec debería incluir tal cual.

---

## D2 — Dónde vive el stack y cómo importa las constantes

### Qué encontré

**El repo no es un workspace.** Verificado:

- No existe `pnpm-workspace.yaml` en la raíz.
- No existe `package.json` en la raíz.
- `backend-pet-tracker/` es el único paquete; su `pnpm-lock.yaml` vive
  dentro del paquete, no en la raíz.

**`backend-pet-tracker/tsconfig.json`** (líneas 2-27) — lo relevante:

```jsonc
"module": "nodenext",  "moduleResolution": "nodenext",
"baseUrl": "./",
"outDir": "./dist",
"paths": { "@/*": ["./src/*"] }
```

Nótese: **no hay `rootDir` explícito.** TypeScript lo infiere del conjunto
de archivos de entrada. Esto es importante para la opción de "import
relativo cruzando rootDir" (ver más abajo): sin `rootDir` fijado, incluir un
archivo de fuera del paquete *desplaza el rootDir inferido hacia arriba* y
la estructura de `dist/` cambia — `dist/main.js` pasaría a
`dist/backend-pet-tracker/src/main.js`, rompiendo `start:prod`
(`node dist/main`, `package.json:14`) y el `tsc-alias -p tsconfig.build.json`
del build.

**El alias `@/` está resuelto en tres sitios distintos, cada uno con su
propio `rootDir`** — esto es exactamente el bug que arregló
`progress/review_fix-jest-e2e-alias.md`:

| Ejecución | Config | Mapper |
|---|---|---|
| Build | `tsconfig.build.json` → `tsconfig.json` + `tsc-alias` | `paths: { "@/*": ["./src/*"] }` |
| Unit tests | bloque `jest` en `package.json:78-97`, `rootDir: "src"` | `"^@/(.*)$": "<rootDir>/$1"` |
| E2E tests | `test/jest-e2e.json`, `rootDir: "."` (= `test/`) | `"^@/(.*)$": "<rootDir>/../src/$1"` |

El fix de 2026-08-01 fue precisamente esa última línea (`<rootDir>/src/$1`
apuntaba a `test/src/*`, inexistente). **La lección aplicable a #20: cada
runner nuevo necesita su propio mapper coherente con su propio `rootDir`, y
el error se manifiesta como `createNoMappedModuleFoundError` en tiempo de
test, no en typecheck.** Si `infra/` trae su propio jest, traerá su propio
mapper, y será el cuarto sitio donde el alias se puede desincronizar.

**`docs/conventions.md:37-62`** documenta el alias como convención dura para
todo código nuevo, con la nota de que scripts fuera de Nest deben correr con
`ts-node -r tsconfig-paths/register`.

**`.gitignore`** (verificado, 28 líneas) **no ignora `cdk.out/`.** Un
`cdk synth` dejaría el árbol sucio y el reviewer, que corre `init.sh` y mira
el working tree, lo marcaría. La spec tiene que añadir `cdk.out/` (y
`infra/node_modules/`, cubierto por el `node_modules/` existente).

**El gate — aquí está el agujero.** `init.config.sh:23-32`:

```bash
INSTALL_CMD="pnpm -C backend-pet-tracker install"
BUILD_CMD="pnpm -C backend-pet-tracker run build"
TEST_CMD="pnpm -C backend-pet-tracker test --passWithNoTests"
LINT_CMD="pnpm -C backend-pet-tracker run lint"
TYPECHECK_CMD="pnpm -C backend-pet-tracker exec tsc --noEmit"
E2E_CMD="pnpm -C backend-pet-tracker run test:e2e"
```

Los seis comandos apuntan explícitamente a `backend-pet-tracker`.
`init.sh` los ejecuta con `eval` uno por uno (líneas 79, 184, 194, 219, 229,
239) y **no descubre paquetes**: no hay un bucle sobre directorios, no hay
glob. Y `.github/workflows/ci.yml:29` corre exactamente un paso:
`bash ./init.sh`.

**Conclusión explícita, tal como pedía el encargo: si `infra/` se añade sin
tocar `init.config.sh`, su lint, su typecheck y sus tests no se ejecutan
nunca — ni en local ni en CI. `cdk synth` tampoco.** El stack podría no
compilar y `init.sh` seguiría dando verde. Esto no es un riesgo teórico: es
el comportamiento garantizado del harness tal como está hoy, y la spec de
#20 **debe** incluir un requisito que lo cierre.

Cerrarlo es barato — encadenar en las variables existentes, sin tocar
`init.sh`:

```bash
INSTALL_CMD="pnpm -C backend-pet-tracker install && pnpm -C infra install"
TEST_CMD="pnpm -C backend-pet-tracker test --passWithNoTests && pnpm -C infra test --passWithNoTests"
TYPECHECK_CMD="pnpm -C backend-pet-tracker exec tsc --noEmit && pnpm -C infra exec tsc --noEmit"
# ... idem LINT_CMD
```

`init.sh` usa `eval` y `set -e`, así que un `&&` encadenado propaga el fallo
correctamente. Cero cambios en `init.sh`, que es código del harness y es
mejor no tocar.

Un detalle práctico: `cdk synth` es el equivalente de "build" para el stack
y **no necesita credenciales AWS** (sintetiza local a `cdk.out/`) mientras el
stack no use `fromLookup` ni `Stack.of(this).account` sin `env` explícito.
Ojo: si se usa el account-id en el nombre del bucket (recomendación D1), el
stack necesita `env: { account, region }` explícito o un token sin resolver;
lo primero implica que `synth` necesita saber el account-id, típicamente vía
`CDK_DEFAULT_ACCOUNT`, **que sí requiere credenciales**. Eso pondría `synth`
en CI en dependencia de credenciales, que es exactamente lo que no queremos.
Alternativa limpia: dejar el token `${AWS::AccountId}` sin resolver
(CloudFormation lo sustituye en deploy) usando `Fn.sub` / `Aws.ACCOUNT_ID`
en lugar de `Stack.of(this).account`. **Esto es un detalle de diseño que la
spec tiene que fijar explícitamente**, porque decidirlo mal significa que
`cdk synth` no puede correr en CI.

### Opciones para que `infra/` consuma `src/aws/constants.ts`

**A. Import relativo cruzando el límite del paquete**
`import { TABLE_POSITIONS } from '../backend-pet-tracker/src/aws/constants';`
Cero infraestructura nueva.
Rompe: el `tsconfig.json` de `infra/` incluye un archivo de fuera de su
directorio, así que su `rootDir` inferido sube a la raíz del repo y su
`outDir` replica la estructura. Peor: `infra/tsconfig.json` compilaría el
archivo del backend con **sus** opciones, no con las del backend — y si
`constants.ts` importara algo (hoy no importa nada, es puro; pero mañana
podría), arrastraría media dependencia del backend hacia `infra/`.
No rompe el build del backend (el backend no sabe que `infra/` existe),
pero es frágil de una forma que no avisa.

**B. Project references de TypeScript (`references` + `composite: true`)**
La opción "correcta" de TypeScript.
Coste: `composite: true` obliga a `declaration: true` (ya está) **y a
`rootDir` explícito** en `backend-pet-tracker/tsconfig.json`, más
`declarationMap`. Cambiar `rootDir` en un tsconfig que hoy lo infiere es
justo el tipo de cambio que puede alterar `dist/` y romper
`start:prod`/`tsc-alias`. Además obliga a `tsc --build` en vez de `tsc`, lo
que cambia `TYPECHECK_CMD`. **Toca el paquete que hoy funciona, para
beneficio de un paquete que aún no existe. Mal reparto de riesgo.**

**C. Convertir el repo en pnpm workspace**
Crear `pnpm-workspace.yaml` + `package.json` raíz, `infra/` declara
`"backend-pet-tracker": "workspace:*"` y hace
`import { ... } from 'backend-pet-tracker/dist/aws/constants'` (o vía
`exports`).
Coste: mueve `pnpm-lock.yaml` a la raíz (regenera el lockfile entero),
cambia `cache-dependency-path` en `.github/workflows/ci.yml:23`, obliga a
`backend-pet-tracker` a declarar `exports`/`main` apuntando a `dist/`, y
crea una dependencia de orden: `infra/` no typechequea hasta que el backend
haya hecho `build`. Es una reestructuración del repo entero para compartir
**catorce constantes string**.

**D. Mover las constantes a un lugar compartido**
Un paquete `shared/` o similar del que dependan ambos. Es C con un paso más
y el mismo coste, más un movimiento de archivo que rompe los imports `@/aws/constants`
de los 4+ consumidores actuales.

**E. `infra/tsconfig.json` con su propio `paths` apuntando al backend**
Sin references, sin workspace: solo un alias de resolución.

```jsonc
// infra/tsconfig.json
"paths": { "@backend/*": ["../backend-pet-tracker/src/*"] }
```

Es A con el import escrito de forma legible y centralizada en un solo sitio
(el tsconfig), en vez de esparcido en cadenas `../../`. Sigue teniendo el
problema del `rootDir` inferido — **salvo que se fije `noEmit: true` en
`infra/tsconfig.json`**, que es perfectamente razonable: CDK no emite JS,
`cdk synth` ejecuta el TypeScript vía `ts-node` (es lo que pone `cdk.json`
por defecto: `"app": "npx ts-node --prefer-ts-exts bin/app.ts"`). Sin emit,
`rootDir` y `outDir` dejan de importar por completo. El único consumidor del
tipado es el typecheck y el runner de tests.

### Recomendación

**Opción E: `infra/` como paquete independiente, no-workspace, con
`noEmit: true` y un `paths` que apunte a `../backend-pet-tracker/src/*`.**

Razones:

1. **No toca `backend-pet-tracker` en absoluto.** Ni `tsconfig.json`, ni
   `package.json`, ni el lockfile, ni CI. El paquete que hoy está verde
   sigue verde por construcción, no por suerte. Esto es lo que descarta B,
   C y D: los tres modifican el paquete sano para acomodar el nuevo.
2. **`noEmit` disuelve el problema entero del `rootDir`.** La razón por la
   que A es frágil es que TypeScript tiene que decidir dónde escribir el
   JS. Si no escribe JS, no hay decisión que salga mal. Y CDK no necesita
   JS emitido: `cdk.json` invoca `ts-node`.
3. Las constantes se importan de verdad, no se copian: el criterio "grep de
   literales duplicados da cero" se cumple de forma verificable y estable.
4. Es reversible. Si mañana el proyecto crece a tres paquetes y el workspace
   se justifica, migrar de E a C es mecánico. Migrar de C a E no lo es.

**Riesgo conocido que la recomendación acepta**, y lo digo explícito porque
es el precio de la opción: `infra/` importa de `../backend-pet-tracker/src/`
por ruta física, así que **mover `backend-pet-tracker/` de sitio rompe
`infra/`**. Con un solo alias en un solo `tsconfig.json` el arreglo es una
línea, pero nada lo detecta automáticamente salvo el typecheck — que es
precisamente por lo que el punto siguiente no es opcional.

**Y el requisito no negociable que acompaña a la recomendación:** encadenar
`infra/` en `INSTALL_CMD`, `LINT_CMD`, `TYPECHECK_CMD` y `TEST_CMD` de
`init.config.sh` con `&&`, sin tocar `init.sh`. Sin esto, la opción E (y
cualquier otra) es un paquete que nadie verifica. Añadir `cdk synth` como
paso también, si y solo si se resuelve que no necesita credenciales (ver la
nota sobre `Aws.ACCOUNT_ID` más arriba).

Y añadir `cdk.out/` a `.gitignore`.

---

## D3 — Sufijo de entorno en los nombres

### Qué encontré

**Los comentarios de `constants.ts` son una restricción real, no una nota
suelta.** `constants.ts:6-8`:

```
// SQS: sin sufijo de entorno — los nombres coinciden con docs/data-model.md
// y con el acceptance_criteria de la feature; otras specs futuras (#8, #9,
// #12, #13, #16) ya asumen estos nombres exactos.
```

Verifiqué qué significa "asumen estos nombres exactos" en la práctica: **no
significa que haya literales esparcidos.** Un barrido de literales de nombres
de recurso en `backend-pet-tracker/src/` y `test/` devuelve, además de las
definiciones en `constants.ts`, solo:

- `src/workers/positions-consumer.service.spec.ts:498` —
  `expect(EVENT_SOURCE).toBe('pet-tracker')`. Es un test que congela el
  valor del contrato de eventos a propósito (#8 R16/R17). Correcto que esté
  ahí; cambiaría solo si se cambiase el contrato de eventos, que no es el
  caso.
- `test/media.e2e-spec.ts:185` — el literal del bucket ya discutido en D1.

Todo lo demás importa de `constants.ts`. **Es decir: el acoplamiento a los
nombres desnudos es de una sola dirección — las specs #8/#9/#12/#13/#16 los
citan en su texto, pero el código está limpio.** Cambiar los nombres es
mecánicamente barato; lo caro es la deuda documental de dejar cinco specs
diciendo `positions-raw` cuando la cola se llama `positions-raw-dev`.

**Qué pasa el día que exista `prod` en la misma cuenta.** Esto sí tiene
consecuencias asimétricas por servicio, y conviene verlas separadas:

| Recurso | Namespace | Qué pasa con dos entornos sin sufijo |
|---|---|---|
| Colas SQS | cuenta + región | **Colisión.** El segundo `cdk deploy` en la misma región falla o, peor, dos stacks se pelean por la misma cola |
| Tabla DynamoDB | cuenta + región | **Colisión.** Y aquí el fallo es el peligroso: dos entornos escribiendo a la misma tabla `positions` |
| Bus EventBridge | cuenta + región | **Colisión** |
| Regla EventBridge | bus + nombre | Colisión (heredada del bus) |
| Bucket S3 | global | Ya resuelto en D1 con sufijo |

El escenario realista de fallo no es "el deploy de prod falla" — un fallo
ruidoso sería bueno. Es: **`dev` y `prod` compartiendo la tabla `positions`
sin que nadie se dé cuenta**, porque CloudFormation, al ver que la tabla ya
existe con otro stack de dueño, o falla (bien) o el operador la importa para
"arreglarlo" (mal). El coste de descubrirlo tarde es datos mezclados.

**Sin embargo**, el free tier de DynamoDB es de 25 RCU + 25 WCU **por cuenta
y región** (ver D4), no por tabla. Es decir: **el día que existan `dev` y
`prod` en la misma cuenta y región, las dos tablas se reparten los mismos 25
RCU/25 WCU gratis, o una de las dos se paga.** Esto significa que un futuro
`prod` probablemente vivirá en otra cuenta (que es además la práctica
recomendada de AWS), y si vive en otra cuenta, **la colisión de nombres no
existe** — los namespaces son por cuenta. El argumento de "necesito sufijo
para el día que haya prod" se debilita bastante bajo esta luz.

### Opciones

**A. Sufijo `-dev` desde ya en todos los nombres**
Elimina la clase de fallo por completo. Coste: renombra `positions-raw` →
`positions-raw-dev` etc., lo que desincroniza cinco specs cerradas
(#8, #9, #12, #13, #16) y `docs/data-model.md` respecto al código. En
LocalStack habría que reprovisionar (barato: `docker compose down -v`). Y
paga hoy un coste documental por un escenario que, según el análisis de
arriba, probablemente nunca llegue en esta forma.

**B. Nombres desnudos en dev, decidir cuando exista prod**
Coste hoy: cero. Riesgo: que "cuando exista prod" alguien despliegue en la
misma cuenta sin acordarse. Mitigable con una línea en `docs/architecture.md`.

**C. Sufijo parametrizado pero con valor vacío en dev**
El stack acepta un `envSuffix` que en dev es `''`, así que los nombres salen
desnudos hoy, y el día que haga falta se pasa `'prod'` sin refactor.
Es el compromiso: cero cambio de nombres hoy, mecanismo listo mañana.
Coste: un parámetro y una función de composición que en dev no hace nada —
exactamente el tipo de flexibilidad especulativa que suele sobrar. Pero aquí
la función de composición **ya hace falta de todas formas para el bucket**
(D1), así que el coste marginal es casi nulo: es reusar el mismo helper.

### Recomendación

**Opción C, con el matiz de que en dev el sufijo produce nombres idénticos a
los de hoy.**

Es decir: el stack compone nombres con el mismo helper que D1
(`nameFor(base, suffix)`), pero para SQS/DynamoDB/EventBridge en `dev` el
sufijo resuelve a cadena vacía y los nombres salen `positions-raw`,
`positions`, `pet-tracker` — **byte a byte lo que hay hoy**. Solo el bucket
S3 lleva sufijo obligatorio, porque solo él tiene namespace global.

Razones:

1. **No desincroniza nada.** Las cinco specs cerradas y `docs/data-model.md`
   siguen siendo verdad. El acceptance criterion #9 de #20 ("con
   `AWS_MODE=aws`, el e2e de ingest corre contra AWS real") depende de que
   el backend encuentre las colas por el nombre que ya tiene en
   `constants.ts` — con nombres desnudos eso funciona sin tocar el runtime.
   Con sufijo `-dev` habría que cablear la resolución de nombres por entorno
   en el backend, que es una feature entera y **no está en el alcance de #20**.
   Esto es, de hecho, el argumento decisivo: la opción A rompe el criterio
   de aceptación #9.
2. El escenario que justificaría A (dev y prod en la misma cuenta y región)
   está desaconsejado por el propio free tier, que es por cuenta. Si prod va
   en otra cuenta, no hay colisión.
3. El mecanismo queda listo por si acaso, y su coste es cero porque el helper
   se escribe igual para el bucket.

**Requisito documental que va con esto:** una línea en
`docs/architecture.md` diciendo que los nombres desnudos asumen **una cuenta
por entorno**, y que un segundo entorno en la misma cuenta exige activar el
sufijo. Sin esa línea, la decisión se pierde y alguien la redescubre por las
malas.

---

## D4 — Mapeo recurso por recurso contra `provisioning.ts`

Fuente: `backend-pet-tracker/src/aws/provisioning.ts` completo (384 líneas),
más `src/aws/constants.ts`. Orden de creación según
`provisionAllResources()` (líneas 331-339).

### Tabla de recursos

| # | Recurso | Tipo | Nombre (constante) | Atributos que fija `provisioning.ts` | Origen (línea) |
|---|---|---|---|---|---|
| 1 | `positions-raw-dlq` | SQS Queue | `QUEUE_POSITIONS_RAW_DLQ` (`constants.ts:10`) | **Ninguno** — todo por defecto de SQS | `ensureQueue` L109 vía `ensureQueueWithDlq` |
| 2 | `positions-raw` | SQS Queue | `QUEUE_POSITIONS_RAW` (`constants.ts:9`) | `RedrivePolicy = {deadLetterTargetArn: <arn #1>, maxReceiveCount: 3}` | L112-117 |
| 3 | `notifications-dlq` | SQS Queue | `QUEUE_NOTIFICATIONS_DLQ` (`constants.ts:12`) | Ninguno | L136-140 |
| 4 | `notifications` | SQS Queue | `QUEUE_NOTIFICATIONS` (`constants.ts:11`) | `RedrivePolicy → #3`, `maxReceiveCount: 3` | L136-140 |
| 5 | `positions` | DynamoDB Table | `TABLE_POSITIONS` (`constants.ts:29`) | `BillingMode: 'PAY_PER_REQUEST'`; `AttributeDefinitions: [{pk, S}, {sk, N}]`; `KeySchema: [{pk, HASH}, {sk, RANGE}]` | L182-195 |
| 5b | TTL de `positions` | UpdateTimeToLive | `TABLE_POSITIONS_TTL_ATTRIBUTE = 'expires_at'` (`constants.ts:32`) | `{AttributeName: 'expires_at', Enabled: true}` — llamada **separada**, tras esperar `ACTIVE` | L204-213 |
| 6 | `pet-tracker-media-local` | S3 Bucket | `BUCKET_MEDIA` (`constants.ts:36`) | `CreateBucket` sin más props | L237 |
| 6b | PublicAccessBlock del bucket | S3 PutPublicAccessBlock | — | `BlockPublicAcls: true`, `IgnorePublicAcls: true`, `BlockPublicPolicy: true`, `RestrictPublicBuckets: true` | L244-254 |
| 7 | `pet-tracker` | EventBridge Bus | `EVENT_BUS_NAME` (`constants.ts:39`) | `CreateEventBus` solo con `Name` | L265 |
| 8 | `geofence-events-dlq` | SQS Queue | `QUEUE_GEOFENCE_EVENTS_DLQ` (`constants.ts:17`) | Ninguno | L289-293 |
| 9 | `geofence-events` | SQS Queue | `QUEUE_GEOFENCE_EVENTS` (`constants.ts:16`) | `RedrivePolicy → #8`, `maxReceiveCount: 3` | L289-293 |
| 10 | `geofence-events` | EventBridge Rule | `RULE_GEOFENCE_EVENTS` (`constants.ts:21`) | `EventBusName: 'pet-tracker'`; `EventPattern: {"source":["pet-tracker"],"detail-type":["position.updated","battery.low"]}` | L296-305 |
| 10b | Target de la regla | PutTargets | — | `Targets: [{Id: 'geofence-events', Arn: <arn de #9>}]`. **Sin `InputTransformer`** (deliberado, #12 D2: el worker despacha por `detail-type`) | L307-313 |

**Totales: 6 colas SQS (3 pares), 1 tabla DynamoDB, 1 bucket S3, 1 bus
EventBridge, 1 regla + 1 target.**

> Nit de documentación encontrado de paso: el docstring de
> `provisionAllResources` (`provisioning.ts:325`) dice "5 colas SQS" y el de
> `runProvisioning` (`run-provisioning.ts:23`) dice "los 8 recursos". Son
> **6 colas** y 10 recursos. Comentarios que quedaron obsoletos cuando #12
> añadió el par `geofence-events`. No bloquea nada; si el implementer pasa
> por ahí, que los corrija.

**Valores constantes relevantes**: `SQS_MAX_RECEIVE_COUNT = 3`
(`constants.ts:26`), `TABLE_POSITIONS_PARTITION_KEY = 'pk'`,
`TABLE_POSITIONS_SORT_KEY = 'sk'`, `TABLE_POSITIONS_TTL_ATTRIBUTE = 'expires_at'`
(`constants.ts:30-32`).

### Atributos que LocalStack acepta pero que en AWS real se comportan distinto

Esta es la parte de la tabla que más valor tiene para la spec.

**① La resource-policy de SQS para el target de EventBridge — falta, y en
AWS real rompe.**

`provisionGeofenceEventsRoute` (L285-314) hace `PutRule` + `PutTargets` y
nada más. No hay `SetQueueAttributes` con una `Policy`, ni se pasa `RoleArn`
en el target. Confirmé por barrido que **no existe ninguna resource-policy de
SQS en todo el repo**.

La documentación de AWS es inequívoca
(`eventbridge/latest/userguide/eb-use-resource-based.html`, sección "Amazon
SQS permissions"):

> "For Lambda, Amazon SNS, and Amazon SQS resources, EventBridge can use
> either an IAM execution role or a resource-based policy. […] If no
> execution role is configured, EventBridge uses resource-based policies on
> the target resource."

Y el statement requerido es:

```json
{
  "Effect": "Allow",
  "Principal": { "Service": "events.amazonaws.com" },
  "Action": "sqs:SendMessage",
  "Resource": "arn:aws:sqs:<region>:<account>:geofence-events",
  "Condition": { "ArnEquals": {
    "aws:SourceArn": "arn:aws:events:<region>:<account>:rule/pet-tracker/geofence-events"
  }}
}
```

En LocalStack Community esto no se nota porque **el enforcement de IAM es
funcionalidad Pro** — el mismo motivo por el que
`docs/architecture.md:103` documenta que `PublicAccessBlock` no se aplica.
En AWS real, sin la policy, **la regla coincide con el evento y la entrega
falla en silencio**: el evento se pierde, no aparece en la cola, y el único
rastro es la métrica `FailedInvocations` de CloudWatch, que nadie está
mirando.

Esto es un **bug latente en `provisioning.ts` que solo se manifiesta en AWS
real**. Como `provisioning.ts` se queda sirviendo únicamente a LocalStack,
no hay que arreglarlo ahí. Pero sí hay que asegurarse de que el stack lo
crea. El constructo `targets.SqsQueue` de CDK está documentado apuntando
justo a esa página de permisos de SQS, lo que indica que gestiona la policy;
**no lo doy por confirmado**. Recomendación concreta para la spec: **un
requisito con test de synth que afirme que el template contiene un
`AWS::SQS::QueuePolicy` sobre la cola `geofence-events` con principal
`events.amazonaws.com`.** Así deja de ser una suposición sobre el
comportamiento de CDK y pasa a ser un hecho verificado en cada `cdk synth`.
Es una aserción de tres líneas con `Template.fromStack(...).hasResourceProperties(...)`.

**② El bucket S3: `PublicAccessBlock` sí se aplica en AWS real.**

`docs/architecture.md:103` ya lo documenta y lo marca como "pendiente de
verificar en un despliegue AWS real". #20 es esa verificación. Detalle
adicional que la spec debe conocer: desde abril de 2023 AWS aplica
`BlockPublicAccess` y `ObjectOwnership: BucketOwnerEnforced` (ACLs
deshabilitadas) **por defecto** en buckets nuevos. Así que en AWS real el
bucket es aún más restrictivo que lo que pide el criterio. El criterio
"los cuatro flags activos" se cumple, pero el test que hoy verifica
*configuración* (`GetPublicAccessBlock`) podría por fin verificar el
*comportamiento* (403 en GET sin firmar) contra AWS real — cerrando el
pendiente de `pet-photos-s3` #6 R8. Es una oportunidad, no un requisito.

**③ Nombre del bucket globalmente único.** Ya cubierto en D1. LocalStack no
tiene namespace global; AWS sí. `CreateBucket` con un nombre tomado devuelve
`BucketAlreadyExists` y el stack entra en rollback.

**④ DynamoDB: `BillingMode` diverge entre `provisioning.ts` y la feature.**

`provisioning.ts:185` fija `BillingMode: 'PAY_PER_REQUEST'`. La descripción
de #20 y su acceptance criterion 2 exigen `PROVISIONED` con 25 RCU / 25 WCU.
**Esto contradice literalmente el criterio 1** ("exactamente los recursos
que hoy crea por SDK `provisioning.ts`"). No es un error de nadie: es una
decisión de costo tomada a conciencia, pero la spec tiene que **declararla
como divergencia explícita y única**, listarla en la tabla de mapeo con una
columna "diverge / por qué", y que el reviewer la valide como intencional en
vez de como incumplimiento. Si no, el mapeo recurso-por-recurso se contradice
a sí mismo.

**⑤ DynamoDB: el TTL borra "en unos días" en AWS real.**

La documentación de AWS (`amazondynamodb/latest/developerguide/TTL.html`):

> "DynamoDB automatically deletes expired items within a few days of their
> expiration time, without consuming write throughput."
> "Items with valid, expired TTL attributes may be deleted by the system at
> any time, typically within a few days after their expiration."

LocalStack tiende a aplicar el TTL de forma mucho más inmediata. **Cualquier
test que escriba un item con `expires_at` en el pasado y luego afirme que
desapareció pasará en LocalStack y fallará contra AWS real** (o tardará
días). No encontré ningún test que haga eso hoy, pero es una trampa que
la spec debería nombrar para que el implementer no la introduzca al escribir
el e2e con `AWS_MODE=aws` del criterio 9.

Nota positiva: los borrados por TTL **no consumen WCU**, así que no comen del
presupuesto de 25 WCU. Confirmado en la cita de arriba.

**⑥ Atributos SQS por defecto.** `provisioning.ts` no fija
`VisibilityTimeout`, `MessageRetentionPeriod`, `ReceiveMessageWaitTimeSeconds`
ni cifrado en ninguna cola. Los defaults de SQS y los de CDK `sqs.Queue`
coinciden en los tres primeros (30 s, 4 días, 0 s). Sobre el cifrado
(SSE-SQS) **no puedo afirmar con seguridad si el default de CDK y el de la
API de SQS coinciden hoy**; no cambia el coste (SSE-SQS es gratis) pero sí
el template. Sugerencia: que el test de synth afirme los valores que
importan en vez de confiar en defaults implícitos.

Y una consecuencia operativa de `ReceiveMessageWaitTimeSeconds = 0`
(short polling): ver D5, apartado de coste.

### Verificación del free tier de DynamoDB (25 RCU / 25 WCU / clase Standard)

Consultado contra la documentación de AWS. **La cifra de la feature es
correcta**, con cuatro matices que la spec debe recoger:

- **25 WCU + 25 RCU + 25 GB de almacenamiento al mes.** Confirmado en la
  página de precios de capacidad provisionada de DynamoDB.
- **Es por región y por cuenta pagadora, no por tabla.** Textual: *"per
  Region, per-payer account basis"*. Consecuencia directa: una segunda tabla
  provisionada en la misma cuenta y región comparte el mismo cupo. Esto es
  lo que alimenta el argumento de D3.
- **Solo clase Standard y solo capacidad provisionada.** Textual: la oferta
  *"uses provisioned capacity and the DynamoDB Standard table class"*.
  Standard-Infrequent Access **no** califica. On-demand tampoco — que es
  exactamente por lo que la feature descarta `PAY_PER_REQUEST`. La decisión
  de la feature está bien fundada.
- **Los backups se pagan aparte.** Point-in-time recovery y los backups
  on-demand **no** están cubiertos; ambos cobran por tamaño de backup.
  El default de CDK para PITR es `false`, así que basta con no activarlo —
  pero conviene que la spec lo diga, porque activarlo es un one-liner
  tentador.
- **TTL no tiene coste propio** y sus borrados no consumen WCU (confirmado
  arriba). Salvedad documentada: en Global Tables, la réplica del borrado TTL
  **sí** consume capacidad replicada. No aplica aquí — pero sí es una razón
  más para usar el constructo `dynamodb.Table` (que emite
  `AWS::DynamoDB::Table`) y **no** `TableV2` (que emite
  `AWS::DynamoDB::GlobalTable`).

**Nota sobre `Table` vs `TableV2` en CDK** — verificado en la referencia de
`aws-cdk-lib.aws_dynamodb.TableProps`: el constructo `Table` crea
`AWS::DynamoDB::Table`, su `billingMode` **ya es `PROVISIONED` por defecto**
(con 5 RCU / 5 WCU, que hay que subir a 25), su `tableClass` **ya es
`STANDARD` por defecto**, `timeToLiveAttribute` existe como prop directa,
y `removalPolicy` es `RETAIN` por defecto. Es decir: el constructo `Table`
sale de fábrica en la configuración que cubre el free tier. **Recomiendo
`dynamodb.Table` y desaconsejo explícitamente `TableV2`**, cuyo default de
billing es on-demand y cuyo tipo de recurso es `GlobalTable`, con el matiz de
TTL replicado de arriba.

**Incertidumbre que declaro abiertamente:** las cifras 25/25/25 están
confirmadas en la página de precios de DynamoDB. Lo que **no** puedo
confirmar es cómo interactúan con la reestructuración del AWS Free Tier del
**15 de julio de 2025**: la página de precios de S3 menciona que los clientes
nuevos reciben *"up to $200 in AWS Free Tier credits"* y que el plan gratuito
está *"available for 6 months after account creation"*, mientras que
`aws.amazon.com/free` sigue afirmando que *"30+ AWS services are always free
within monthly usage limits on both the Free and Paid plans"*. Si DynamoDB
está en esa lista de "always free" para cuentas del plan nuevo, la cifra
aplica; si no, el consumo saldría de los créditos y se agotaría. **No sé la
fecha de creación de esta cuenta ni en qué plan está** → pregunta para el
humano.

---

## D5 — Riesgos y lo que no toca

### Salvaguardas que ya existen

**① El guarda de `run-provisioning.ts`.** Líneas 39-42:

```ts
if (config.mode === 'aws') {
  logger.error('AWS_MODE=aws no está permitido en el provisioning local');
  return 1;
}
```

Se ejecuta **antes** de construir ningún cliente (los clientes se crean en
L44-49), así que un `.env` mal puesto no puede crear los 10 recursos en la
cuenta real. Confirmado también en `progress/history.md` (sesión 2026-08-09
(2), líneas 795-797). Es la salvaguarda más importante que hay y **no la
toca #20**: `provisioning.ts` y `run-provisioning.ts` quedan intactos.

**② `MissingAwsEndpointError`.** `aws-clients.ts:22-39` y L60-63: en modo
`local`, si `AWS_ENDPOINT_URL` falta o está vacía, se aborta antes de
construir clientes — para que el SDK v3 no caiga a su endpoint público de
AWS por defecto. En modo `aws` el guarda no aplica (correcto: en modo `aws`
sí queremos el endpoint público).

**③ El smoke test de #19 es de solo lectura.**
`test/aws-real-smoke.e2e-spec.ts` solo hace `ListQueuesCommand`, se
auto-salta con `describe.skip` si `AWS_MODE !== 'aws'`, y además exige que
`AWS_ACCESS_KEY_ID` esté **ausente** (`assertNoStaticAccessKey`, L12-18) para
forzar el uso de la sesión de `aws login`. Buen patrón, y el criterio de
aceptación 9 de #20 (e2e de ingest contra AWS real) debería seguirlo:
gate por `AWS_MODE`, skip por defecto.

**④ Los e2e se saltan si la infra no responde.** `init.sh:205-224` comprueba
los puertos 5432 y 4566 antes de correr `E2E_CMD`. El e2e contra AWS real de
#20 **no** debe engancharse a ese mecanismo (no hay puerto local que
comprobar); debe auto-saltarse por `AWS_MODE` como hace el smoke de #19.

### Riesgos de gastar dinero sin querer

**Recursos con coste fijo por hora: ninguno en el alcance.** Verificado
servicio por servicio:

| Recurso | ¿Coste fijo por existir? | Nota |
|---|---|---|
| Colas SQS (×6) | No | Solo por request |
| Tabla DynamoDB provisionada | **Sí, técnicamente** — la capacidad provisionada se cobra por hora *provisionada*, no por consumida | Pero 25+25 es justo el cupo gratis. Si se pasa de 25, **se paga desde la primera hora** |
| Bucket S3 vacío | No | Confirmado: sin objetos, sin requests, sin cargo |
| Bus EventBridge custom | No | Confirmado: no hay cuota fija por bus ni por regla |
| Regla EventBridge | No | — |

La tabla DynamoDB merece el matiz que puse: **es el único recurso del stack
que se cobra por tiempo y no por uso**, y está justo en el borde del cupo.
Subir a 26 WCU "un momento para probar" empieza a costar dinero
inmediatamente y de forma continua hasta que se baje. La feature ya lo
asume ("se acepta throttling si el ingest supera esa capacidad") — bien.

**Coste real que sí existe, aunque sea pequeño: EventBridge.** Los eventos
custom cuestan **$1.00 por millón de eventos ingeridos y no tienen free
tier** (los eventos de servicios AWS sí son gratis; los custom no). La
entrega a targets en la misma cuenta es gratis. Para un dev con un simulador
esto es del orden de céntimos, pero conviene que la spec lo diga: **es la
única línea del stack que factura desde el primer evento.**

**Riesgo que no está en el radar de la feature y creo que debería: el
consumo de requests SQS con los workers corriendo.**

Los consumidores usan short polling — `CONSUMER_WAIT_TIME_SECONDS = 1`
(`src/workers/positions-consumer.service.ts:46`,
`src/workers/alerts-engine/alerts-engine.constants.ts:11`,
`src/workers/notifier/notifier.constants.ts:10`) — y se agendan por
`setInterval`:

| Worker | Intervalo | Origen |
|---|---|---|
| Poller (Wialon) | 60 s | `ingestion-scheduler.service.ts:9` |
| Positions consumer | **15 s** | `ingestion-scheduler.service.ts:10` |
| Alerts-engine consumer | 60 s | `alerts-engine-scheduler.service.ts:9` |
| Notifier consumer | 60 s | `notifier.constants.ts:3` |

Con el backend corriendo 24/7 y **el sistema completamente en reposo**, el
suelo de `ReceiveMessage` es aproximadamente:

- positions: 4/min × 60 × 24 × 30 ≈ **172 800/mes**
- alerts-engine: 1/min × 60 × 24 × 30 ≈ **43 200/mes**
- notifier: ≈ **43 200/mes**
- **Total ≈ 259 000 requests/mes en reposo**, ~26 % del millón gratuito.

Margen cómodo para un dev, pero conviene saberlo: si `drainOnce()` itera
hasta vaciar la cola, si hay tráfico real, o si dos máquinas apuntan a la
misma cuenta, la cifra se multiplica. **No es un bloqueante para #20** —
es información para la sección de riesgos de la spec, y una razón para no
dejar el backend con `AWS_MODE=aws` corriendo de fondo sin querer.
(Las tres DLQ nunca se consultan, así que no aportan requests.)

### Recursos implícitos que algunos constructos CDK arrastran

Revisado explícitamente porque el criterio de aceptación 7 lo exige. Los
casos a vigilar, en orden de probabilidad de aparecer por descuido:

1. **`s3.Bucket` con `autoDeleteObjects: true` → crea una Lambda de custom
   resource + su rol IAM + su log group.** Es la trampa más común y la más
   fácil de introducir, porque es lo que uno pone para que `cdk destroy`
   funcione limpio. La Lambda no cuesta nada en reposo, pero **viola el
   criterio "el stack no declara ningún recurso con costo fijo por hora"**
   en espíritu (un log group retiene datos y se cobra por GB almacenado) y
   desde luego viola "solo los recursos que crea `provisioning.ts`".
   **La spec debe prohibirlo explícitamente.**
2. **`removalPolicy: RETAIN` es el default** para `Table` y `Bucket`. Efecto:
   `cdk destroy` **deja la tabla y el bucket en pie**. Consecuencias: (a) el
   nombre del bucket sigue tomado, así que un redeploy con el mismo nombre
   falla; (b) la tabla sigue provisionada a 25/25 consumiendo el cupo
   gratuito de la cuenta. No es un coste directo, pero sí una sorpresa. La
   spec debe **decidir y documentar** la política de removal en vez de
   heredarla por omisión.
3. **Log groups.** Ninguno de los cinco tipos de recurso del alcance crea
   log groups por sí solo. Solo aparecerían vía custom resources (punto 1) o
   si alguien añade logging de EventBridge a CloudWatch Logs.
4. **Alarmas CloudWatch.** Ningún constructo del alcance crea alarmas
   automáticamente. Las tres primeras métricas/alarmas por cuenta son
   gratis de todas formas, pero no hacen falta.
5. **KMS.** Ningún constructo del alcance crea una CMK con los defaults
   propuestos. Cifrado SSE-SQS y SSE-S3 usan claves gestionadas por AWS,
   gratis. **No pasar `encryptionMasterKey` ni `encryptionKey` a nada** —
   una CMK cuesta ~$1/mes por existir, que es literalmente un coste fijo.

**El `cdk bootstrap` (que lo corre el humano) crea recursos aparte del
stack**, y conviene que estén en la spec para que nadie se sorprenda al
verlos en la consola. Según la documentación de CDK v2, la stack `CDKToolkit`
provisiona: un bucket S3 de staging
(`cdk-hnb659fds-assets-<account>-<region>`), un repositorio ECR
(`cdk-hnb659fds-container-assets-...`), cinco roles IAM
(`CloudFormationExecutionRole`, `DeploymentActionRole`, `FilePublishingRole`,
`ImagePublishingRole`, `LookupRole`) y un parámetro SSM de versión.
Dos notas relevantes:

- **Ya no crea una KMS CMK por defecto.** Textual de la doc: *"Earlier
  versions of the bootstrap template created an AWS KMS key in each
  bootstrapped environment by default. […] The current default is no KMS
  key, which helps avoid these charges."* Bien: nada que hacer, solo no
  pasar `--bootstrap-customer-key`.
- Ninguno de esos recursos tiene coste fijo por hora; el bucket y el ECR
  cobran por almacenamiento, y este stack no publica assets (no hay Lambdas
  ni imágenes), así que el consumo será mínimo o nulo. La doc avisa igual:
  *"Since bootstrapping provisions resources in your environment, you may
  incur AWS charges when those resources are used."*
- Permisos para bootstrap, según la doc: `cloudformation:*`, `ecr:*`,
  `ssm:*`, `s3:*`, `iam:*`. Coherente con lo que dice la feature ("lo corre
  un humano con permisos de IAM"). Y **PowerUserAccess no incluye `iam:*`**,
  por eso el bootstrap no puede correrlo el rol de deploys — la feature ya
  lo tiene bien planteado. Sugerencia: `cdk bootstrap --termination-protection`,
  recomendado por la propia doc, porque borrar la stack de bootstrap no tiene
  recuperación general.

### Lo que el stack no toca (confirmado)

- `backend-pet-tracker/src/aws/provisioning.ts` — intacto, sigue sirviendo a
  LocalStack.
- `backend-pet-tracker/src/aws/run-provisioning.ts` — intacto, incluido su
  guarda de `AWS_MODE=aws`.
- Postgres sigue en Docker. Sin RDS, sin Fargate, sin NAT Gateway, sin VPC.
  Ninguno de los cinco servicios del alcance necesita VPC, así que no hay
  riesgo de que se cuele un NAT Gateway (que es, con diferencia, el recurso
  que más dinero quema por hora en una cuenta de dev olvidada).

---

## Preguntas para el humano

Solo lo que de verdad no puedo decidir ni averiguar yo.

1. **¿En qué plan de Free Tier está la cuenta AWS, y cuándo se creó?**
   La reestructuración del 2025-07-15 introdujo un plan con créditos
   (~$200) y ventana de 6 meses, frente al esquema clásico de "always
   free" + 12 meses. Las cifras 25 RCU / 25 WCU / 25 GB están confirmadas en
   la documentación de DynamoDB, pero si esta cuenta está en el plan nuevo,
   hay que confirmar que DynamoDB sigue en la lista de "always free" para
   ese plan y, sobre todo, **qué pasa a los 6 meses o al agotar créditos**
   (la cuenta puede cerrarse automáticamente si no se pasa a plan de pago).
   Esto no cambia el diseño del stack, pero sí el riesgo operativo de
   dejar recursos desplegados.

2. **¿Habrá algún día un entorno `prod` en esta misma cuenta y región?**
   Mi recomendación de D3 (nombres desnudos en dev, mecanismo de sufijo
   listo pero inactivo) asume que no — que `prod`, si llega, va en otra
   cuenta. Es lo que recomienda AWS y lo que sugiere que el free tier de
   DynamoDB sea por cuenta. Si la intención es lo contrario, la
   recomendación de D3 cambia a "sufijo desde ya" y hay que asumir el coste
   documental de renombrar en cinco specs cerradas — y, más importante, hay
   que resolver antes cómo el backend descubre los nombres por entorno,
   porque eso rompe el criterio de aceptación 9 tal como está escrito.

3. **¿Se acepta que el bucket de AWS real se llame distinto que el de
   LocalStack, con la consecuencia de que el backend en `AWS_MODE=aws`
   todavía no sabrá resolver su nombre?**
   Mi recomendación de D1 lo asume y deja ese cableado para una feature
   posterior. Si se quiere que #20 entregue también un backend capaz de
   apuntar al bucket real, eso **amplía el alcance** de la feature y hay que
   decirlo antes de que `spec_author` escriba la spec, no después.

4. **¿La política de `removalPolicy` para la tabla y el bucket?**
   El default de CDK es `RETAIN` (nada se borra con `cdk destroy`). Es lo
   seguro para datos, pero significa que limpiar el entorno requiere pasos
   manuales, y que el nombre del bucket queda tomado. `DESTROY` es lo cómodo
   para un entorno dev desechable, pero para el bucket suele arrastrar
   `autoDeleteObjects: true`, que **crea una Lambda de custom resource** y
   contradice el criterio de aceptación 7. No hay opción sin trade-off, y es
   una decisión de operación, no de arquitectura.

5. **¿`cdk synth` debe correr dentro del gate de `init.sh` / CI?**
   Yo recomiendo que sí (es el "build" del paquete `infra/`), pero solo
   funciona sin credenciales si el stack evita resolver el account-id en
   tiempo de síntesis — lo que condiciona cómo se compone el nombre del
   bucket de D1 (`Aws.ACCOUNT_ID` como token sin resolver, en vez de
   `Stack.of(this).account`). Si se prefiere la otra vía, `synth` queda
   fuera de CI y hay que aceptar que solo se verifica en local.

---

## Anexo — requisitos "de una línea" que la spec debería recoger

Cosas pequeñas, concretas y verificables que encontré por el camino y que se
perderían si no quedan escritas:

- `backend-pet-tracker/test/media.e2e-spec.ts:185` — sustituir el literal
  `'pet-tracker-media-local'` por `BUCKET_MEDIA`, que ya está importado en
  la línea 15 de ese mismo archivo.
- `.gitignore` — añadir `cdk.out/`.
- `init.config.sh` — encadenar `infra/` con `&&` en `INSTALL_CMD`,
  `LINT_CMD`, `TYPECHECK_CMD` y `TEST_CMD`. Sin tocar `init.sh`.
- `docs/architecture.md:103` — la fila de la tabla de equivalencias que cita
  `pet-tracker-media-local` y marca el enforcement de PublicAccessBlock como
  "pendiente de verificar en un despliegue AWS real". #20 puede cerrar ese
  pendiente.
- `docs/architecture.md` — una línea nueva registrando que los nombres
  desnudos de SQS/DynamoDB/EventBridge asumen **una cuenta AWS por entorno**.
- Test de synth que afirme la existencia de `AWS::SQS::QueuePolicy` sobre
  `geofence-events` con principal `events.amazonaws.com` (el punto ① de D4).
- Usar `dynamodb.Table`, **no** `dynamodb.TableV2`.
- No pasar `autoDeleteObjects`, `encryptionMasterKey` ni `encryptionKey` a
  ningún constructo.
- Nit opcional: los docstrings de `provisioning.ts:325` ("5 colas SQS") y
  `run-provisioning.ts:23` ("los 8 recursos") quedaron obsoletos tras #12.
  Son 6 colas y 10 recursos.
