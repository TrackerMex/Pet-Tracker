# Verification — Cómo demostrar que una feature funciona

> Antes de declarar cualquier feature como `done`, el implementer debe verificar
> todos los puntos de esta guía. El reviewer repetirá los pasos críticos de
> forma independiente.

---

## Verificación base (toda feature)

Los comandos exactos viven en `init.config.sh` de este proyecto.

### 1. Build limpio

```bash
$BUILD_CMD
# Debe terminar sin errores (ver init.config.sh para el comando real)
```

### 2. Tests sin regresión

```bash
$TEST_CMD
# Todos los tests previos deben seguir pasando
```

### 3. Init verde

```bash
./init.sh
# Debe terminar con "✅ Todo verde"
```

---

## Disciplina TDD

Esta es la regla central de verificación de este harness, no una sugerencia:

1. **El implementer escribe el test ANTES que el código.** Por cada requisito
   `R<n>` de `specs/<feature>/requirements.md`: primero un test que falla
   (rojo), después la implementación mínima que lo pasa (verde), después
   refactor manteniendo los tests en verde. Esto es exactamente el checklist
   de `specs/<feature>/tasks.md`.
2. **Cada test nombra su requisito.** Convención: `describe('R1: ...', ...)`
   o el equivalente idiomático del framework de test de `NestJS + TypeScript + pnpm + LocalStack (AWS local)`
   (documentado en `docs/conventions.md`).
3. **El reviewer verifica en el diff/historia** que los tests existen y
   nombran los R-ids correctos — no le basta con que "algo" tenga cobertura.
   Si una feature no tiene tests que nombren sus requisitos, el reviewer
   **rechaza**, sin excepción.
4. **`specs/<feature>/traceability.md` se actualiza en cada commit**, nunca
   al final: cada fila pasa de "pendiente" a `test::nombre` + `hash commit`
   tan pronto ese requisito queda verde.

---

## Verificación por feature (a rellenar por el proyecto)

<!-- Cuando el proyecto tenga features concretas, añade aquí un bloque de
     verificación manual por feature (curl, comandos de CLI, pasos de UI),
     análogo a:

### Feature <id> — <nombre>

```bash
# pasos de verificación manual específicos de esta feature
```
-->

### Feature 19 — aws-real-credentials

1. Inicia una sesión válida con `aws login`.
2. En el `.env` raíz, comenta `AWS_ACCESS_KEY_ID=test` y
   `AWS_SECRET_ACCESS_KEY=test`. La cadena del SDK prioriza esas variables
   sobre la sesión y la suite falla de forma explícita si siguen presentes.
3. Desde la raíz del repositorio, ejecuta:

```bash
AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/aws-real-smoke.e2e-spec.ts
```

El `--` antes de `--runInBand` es obligatorio: sin él pnpm no reenvía los flags
a jest. En PowerShell no existe el prefijo `VAR=valor comando`, así que usa
Bash, o exporta `$env:AWS_MODE='aws'` en una línea aparte.

Resultado esperado: una suite con dos tests verdes, **sin `skipped`** — si la
suite aparece saltada, `AWS_MODE` no llegó al proceso. La única llamada remota
es `ListQueues`; no crea ni modifica recursos. Después de verificar, restaura
las dos credenciales dummy para seguir usando LocalStack.

### Feature 20 — aws-cdk-dev-stack

Estos pasos crean y usan recursos AWS reales. Los ejecuta el humano, en orden,
y registra cada resultado en `progress/impl_aws-cdk-dev-stack.md` con ARNs y
account-id redactados.

1. **R17 — Billing.** En la consola de AWS Billing, confirma que la cuenta del
   plan nuevo (creada después del 2025-07-15) cubre DynamoDB Standard
   provisionado hasta 25 RCU, 25 WCU y 25 GB. Registra también qué ocurre al
   agotar los créditos o al cumplirse la ventana de 6 meses antes de desplegar.
2. **R18 — Bootstrap.** Comenta **las tres** variables de LocalStack en el
   `.env` raíz — `AWS_ENDPOINT_URL`, `AWS_ACCESS_KEY_ID` y
   `AWS_SECRET_ACCESS_KEY`. Comentar solo las credenciales **no basta**: el SDK
   v3 lee `AWS_ENDPOINT_URL` del entorno por su cuenta, así que con esa variable
   puesta `AWS_MODE=aws` sigue hablando con LocalStack y los tests pasan en
   verde sin tocar AWS (ocurrió de verdad al cerrar #20, ver
   `progress/impl_aws-cdk-dev-stack.md` §E2E AWS real).

   Después inicia una sesión válida con `aws login` y usa un principal con
   `iam:*`. `PowerUserAccess` **no** los incluye; confírmalo antes de gastar un
   intento:

   ```bash
   aws iam simulate-principal-policy \
     --policy-source-arn arn:aws:iam::<accountId>:user/<user> \
     --action-names iam:CreateRole iam:AttachRolePolicy iam:PutRolePolicy \
     --query 'EvaluationResults[].{action:EvalActionName,decision:EvalDecision}'
   ```

   Si sale `implicitDeny`, adjunta `AdministratorAccess` al usuario desde la
   consola con el root user, corre el bootstrap y **quítala después**: los
   deploys de R19-R20 funcionan con PowerUserAccess, verificado.

   ```bash
   pnpm -C infra exec cdk bootstrap aws://<accountId>/us-east-1 --termination-protection
   ```

   No añadas `--bootstrap-customer-key`.
3. **R19 — Primer deploy.** Con PowerUserAccess y la sesión anterior:

   ```bash
   pnpm -C infra exec cdk deploy PetTrackerDev --require-approval never
   ```

   `--require-approval never` hace falta si lo lanzas desde un agente: sin TTY,
   CDK crea el changeset y se queda esperando una confirmación que nadie puede
   dar (`terminal (TTY) is not attached`). El cambio que pide aprobar es el de
   R11, la `QueuePolicy` de `geofence-events`. Desde una terminal normal puedes
   omitir el flag y confirmar a mano.

   Debe terminar en `CREATE_COMPLETE`. El contador de CDK dirá `12/12` porque
   incluye el propio `AWS::CloudFormation::Stack`; los recursos de R13 son 11.
   No te fíes del contador, cuéntalos:

   ```bash
   aws cloudformation list-stack-resources --stack-name PetTrackerDev \
     --query 'StackResourceSummaries[].ResourceType' --output json
   ```
4. **R20 — Deploy idempotente.** Ejecuta de nuevo el mismo comando `cdk deploy`
   sin cambiar `infra/`. Debe reportar `no changes` y no actualizar la stack.
5. **R21 — Ingest real.** Desde Bash, ejecuta la suite específica:

   ```bash
   AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/aws-real-ingest.e2e-spec.ts
   ```

   Ojo con el shell: el prefijo `!` de Claude Code corre **Bash**, no
   PowerShell. Si escribes ahí la forma `$env:AWS_MODE='aws'`, Bash la rechaza
   con `command not found`, `AWS_MODE` no llega al proceso y la suite se salta
   entera — verde falso por omisión. Usa `$env:` solo en una terminal
   PowerShell de verdad.

   Debe quedar verde y **sin `skipped`**.

   Desde la feature 21 la guarda automática aborta la corrida si
   `AWS_ENDPOINT_URL` sigue definida: resolver la configuración lanza
   `UnexpectedAwsEndpointError` antes de construir ningún cliente. El
   procedimiento manual ya no es la única red contra un verde falso.

   Como verificación positiva opcional, comprueba el destino de una de estas
   dos formas:

   - Mira los `QueueUrl` del output: si aparece
     `localhost.localstack.cloud` o el account `000000000000`, fuiste a
     LocalStack.
   - Mejor, prueba positiva: apaga LocalStack
     (`docker compose stop localstack`) y repite la suite. Si sigue verde, fue
     contra AWS real sin ambigüedad.

   Al terminar, restaura las tres variables comentadas, vuelve a
   `AWS_MODE=local` y levanta LocalStack (`docker compose start localstack`).

Consecuencias de las políticas de borrado: si el bucket tiene objetos,
`cdk destroy` falla y hay que vaciarlo manualmente antes; la tabla retenida
sigue provisionada a 25/25 y consumiendo el cupo de la cuenta después de
destruir la stack, hasta que el humano la elimine por separado.

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

### Feature 23 — init-env-drift-warning

Desde Git Bash y con la infraestructura local levantada, verifica el `.env`
incompleto sin modificarlo:

```bash
stat -c '%Y %s' .env
./init.sh 2>&1 | tee /tmp/init-env-drift.txt
stat -c '%Y %s' .env
./init.sh; echo $?
```

Los dos `stat` deben ser idénticos y el último comando debe imprimir `0`. Con
las ocho claves del caso de #23 ausentes, §2 debe incluir exactamente:

```text
⚠️  .env desactualizado: faltan 8 claves de .env.example
⚠️    gates ausentes (apagan features enteras en silencio): ACTIVITY_AGGREGATOR_ENABLED, ALERTS_ENGINE_ENABLED, EMAIL_ENABLED, PUSH_ENABLED
⚠️    configuración ausente: AWS_MODE, SIM_HOME_LAT, SIM_HOME_LNG, SIM_SEED
⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example
```

Para R9(b), captura `/tmp/env-section-antes.txt` antes de editar `init.sh`.
Después usa una copia temporal con un `.env` completo; no reemplaces el `.env`
humano:

```bash
tmp_dir="$(mktemp -d)"
cp init.sh init.config.sh env-drift.mjs .env.example "$tmp_dir/"
cp .env.example "$tmp_dir/.env"
(cd "$tmp_dir" && ./init.sh 2>&1 | sed -n '/→ Verificando variables de entorno/,/→ Instalando dependencias/p') > /tmp/env-section-despues.txt
diff /tmp/env-section-antes.txt /tmp/env-section-despues.txt
rm -r "$tmp_dir"
```

El `diff` debe salir vacío y la captura no debe contener ninguna línea de
deriva. Esta feature no añade variables de entorno.

### Feature 28 — test-dev-resource-isolation

Este procedimiento manual lo ejecuta un humano desde la raíz del repositorio.
Compara las tres colas de desarrollo antes y después de la corrida e2e
completa; los valores deben quedar exactamente iguales.

```bash
# 1. Infra levantada y recursos de ambos entornos creados
docker compose up -d
pnpm -C backend-pet-tracker run provision:local

# 2. Recuento ANTES, de las tres colas de desarrollo
for q in positions-raw notifications geofence-events; do
  aws --endpoint-url http://localhost:4566 sqs get-queue-attributes \
    --queue-url "$(aws --endpoint-url http://localhost:4566 sqs get-queue-url \
      --queue-name "$q" --query QueueUrl --output text)" \
    --attribute-names ApproximateNumberOfMessages \
      ApproximateNumberOfMessagesNotVisible ApproximateNumberOfMessagesDelayed
done

# 3. Corrida e2e COMPLETA
pnpm -C backend-pet-tracker run test:e2e

# 4. Recuento DESPUÉS: repetir el paso 2
# Esperado: los tres recuentos idénticos a los del paso 2.
```

### Feature 51 — media-bucket-aws-mode

Este smoke crea tráfico S3 y un objeto temporal en la cuenta AWS real. Solo lo
ejecuta el humano. Antes de empezar, usa una sesión válida de `aws login` y
comenta en el `.env` raíz las tres variables de LocalStack:
`AWS_ENDPOINT_URL`, `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`. Si alguna
sigue activa, las guardas abortan antes de llamar a AWS.

Obtén y revisa el nombre del bucket desplegado por `PetTrackerDev`:

```bash
aws s3 ls | grep pet-tracker-media
export MEDIA_BUCKET_NAME="pet-tracker-media-dev-<accountId>"
test "$MEDIA_BUCKET_NAME" != "pet-tracker-media-local"
```

Sustituye `<accountId>` por el valor de la salida; no copies literalmente el
placeholder. El nombre debe empezar por `pet-tracker-media-dev-` y nunca por
`pet-tracker-media-local`.

#### 1. Round-trip gated a nivel adapter

Desde la raíz del repositorio:

```bash
AWS_MODE=aws MEDIA_BUCKET_NAME="$MEDIA_BUCKET_NAME" \
  pnpm -C backend-pet-tracker run test:e2e -- \
  --runInBand test/aws-real-media.e2e-spec.ts
```

Resultado esperado: una suite con dos tests verdes y **cero `skipped`**. La
suite construye `PhotoStorageS3Adapter` con la configuración real, firma un
PUT, sube bytes, firma un GET, compara los bytes y borra el objeto
`smoke/<timestamp>-<uuid>.bin` con `DeleteObject` al cerrar. Si aparece
`skipped`, `AWS_MODE=aws` no llegó al proceso. No aceptes un verde omitido.

#### 2. Flujo HTTP de la aplicación

Usa un owner y una mascota existentes en el Postgres local. Arranca el backend
en modo AWS con los workers desactivados para no generar tráfico ajeno al
smoke:

```bash
AWS_MODE=aws MEDIA_BUCKET_NAME="$MEDIA_BUCKET_NAME" \
POLLER_ENABLED=false ACTIVITY_AGGREGATOR_ENABLED=false \
ALERTS_ENGINE_ENABLED=false NOTIFIER_ENABLED=false REMINDERS_ENABLED=false \
  pnpm -C backend-pet-tracker run start
```

En otra terminal, define los datos de prueba y obtiene el token. `PHOTO_FILE`
debe apuntar a una imagen JPEG pequeña y `PET_ID` a una mascota cuyo owner sea
el usuario del login:

```bash
API_BASE=http://localhost:3000/v1
LOGIN_EMAIL='owner@example.com'
LOGIN_PASSWORD='<password>'
PET_ID='<pet-uuid>'
PHOTO_FILE='/ruta/a/smoke.jpg'

LOGIN_BODY="$(jq -n \
  --arg email "$LOGIN_EMAIL" \
  --arg password "$LOGIN_PASSWORD" \
  '{email: $email, password: $password}')"

AUTH_TOKEN="$(curl --fail --silent --show-error \
  -H 'Content-Type: application/json' \
  -d "$LOGIN_BODY" \
  "$API_BASE/auth/login" | jq -er '.access_token')"

UPLOAD_URL="$(curl --fail --silent --show-error \
  -X POST \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"contentType":"image/jpeg"}' \
  "$API_BASE/pets/$PET_ID/photo-upload-url" | jq -er '.uploadUrl')"

curl --fail --silent --show-error \
  -X PUT -H 'Content-Type: image/jpeg' \
  --data-binary "@$PHOTO_FILE" "$UPLOAD_URL"

PHOTO_URL="$(curl --fail --silent --show-error \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "$API_BASE/pets/$PET_ID" | jq -er '.photoUrl')"

DOWNLOADED_FILE="$(mktemp)"
curl --fail --silent --show-error "$PHOTO_URL" --output "$DOWNLOADED_FILE"
cmp "$PHOTO_FILE" "$DOWNLOADED_FILE"
rm "$DOWNLOADED_FILE"
```

El `cmp` debe salir sin diferencias. Al terminar, detén el backend, vuelve a
`AWS_MODE=local`, restaura las tres variables de LocalStack en `.env`, elimina
la variable exportada con `unset MEDIA_BUCKET_NAME` y registra el resultado
en `progress/impl_media-bucket-aws-mode.md`. Solo el humano marca la casilla
R5 en `specs/media-bucket-aws-mode/requirements.md`; hasta entonces la feature
permanece `in_progress`.

---

## Notas para el implementer

- No declares done solo porque el build pasa. Prueba los casos edge (errores,
  permisos, condiciones límite).
- Los scripts de verificación manual (curl, CLI, etc.) no sustituyen a los
  tests automáticos exigidos por la disciplina TDD.
- Si alguna verificación falla, documenta por qué en `progress/impl_<feature>.md`
  antes de reportar al leader.
