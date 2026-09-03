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

### Feature 44 — auth-forgot-password

Usa una cuenta local ya registrada y verificada cuyo password anterior
conozcas. Levanta Postgres y LocalStack, y arranca el backend guardando su
salida para poder recuperar el token del log estructurado:

```bash
docker compose up -d
pnpm -C backend-pet-tracker run start:dev 2>&1 | tee /tmp/pet-tracker-auth-forgot.log
```

En otra terminal, solicita el reset. La respuesta debe ser siempre
`{"requested":true}` y no debe contener el token:

```bash
export API_BASE='http://localhost:3000/v1'
export EMAIL='usuario-verificado@example.com'
export OLD_PASSWORD='<password-anterior>'
export NEW_PASSWORD='<password-nuevo-de-8-a-128-caracteres>'

curl --fail --silent --show-error \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\"}" \
  "$API_BASE/auth/forgot-password"
```

Localiza el último evento del email solicitado y copia únicamente el campo
`token` de su JSON a `RESET_TOKEN`. El evento esperado es
`auth.password_reset.issued`; el token aparece en claro solo en este log local
y la base de datos guarda su SHA-256:

```bash
rg 'auth\.password_reset\.issued' /tmp/pet-tracker-auth-forgot.log | tail -1
export RESET_TOKEN='<token-del-evento>'
```

Consume el token y comprueba el round-trip de login. El reset debe devolver
`{"reset":true}`, el password anterior debe dar `401` y el nuevo `200`:

```bash
curl --fail --silent --show-error \
  -H 'Content-Type: application/json' \
  -d "{\"token\":\"$RESET_TOKEN\",\"password\":\"$NEW_PASSWORD\",\"passwordConfirmation\":\"$NEW_PASSWORD\"}" \
  "$API_BASE/auth/reset-password"

curl --silent --output /tmp/login-old.json --write-out '%{http_code}\n' \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$OLD_PASSWORD\"}" \
  "$API_BASE/auth/login"

curl --silent --output /tmp/login-new.json --write-out '%{http_code}\n' \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$NEW_PASSWORD\"}" \
  "$API_BASE/auth/login"

rm -f /tmp/login-old.json /tmp/login-new.json /tmp/pet-tracker-auth-forgot.log
unset API_BASE EMAIL OLD_PASSWORD NEW_PASSWORD RESET_TOKEN
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

### Feature 52 — android-maps-api-key

Este procedimiento prepara una clave restringida de Maps SDK for Android y
regenera el dev build que la incorpora. La clave real nunca se pega en el
repositorio ni en los reportes de progreso.

Desde #54, `app.config.ts` transporta la clave mediante
`android.config.googleMaps.apiKey`. El prebuild sigue generando la misma
meta-data `com.google.android.geo.API_KEY`, por lo que su `grep` y el resto de
este runbook no cambian.

1. Haz un prebuild inicial sin clave para generar `android/` y
   `android/app/debug.keystore`. La config avisa por consola, pero no aborta:

   ```bash
   cd mobile-pet-tracker && npx expo prebuild --clean --platform android
   ```

2. Obtén la SHA-1 del keystore de debug desde el proyecto Android generado:

   ```bash
   cd mobile-pet-tracker/android && ./gradlew signingReport
   ```

   En Windows usa `gradlew.bat signingReport`. Como alternativa, desde
   `mobile-pet-tracker/android` ejecuta:

   ```bash
   keytool -J-Duser.language=en -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

   El flag `-J-Duser.language=en` es obligatorio: con locale español,
   `keytool` puede terminar con `MissingFormatArgumentException`.

3. En Google Cloud, con billing activo, habilita **Maps SDK for Android** y
   crea una clave de API. Restringe la aplicación Android al package
   `com.trackermex.pettracker` más la SHA-1 del paso 2, y restringe la clave
   por API para permitir únicamente Maps SDK for Android.

4. Inyecta la clave localmente sin commitearla. Desde
   `mobile-pet-tracker/`, si todavía no existe `.env`, ejecuta:

   ```bash
   cp .env.example .env
   ```

   Después edita ese archivo y define
   `GOOGLE_MAPS_API_KEY_ANDROID=<clave>`.

5. Regenera e instala el dev build. Este paso es obligatorio después de crear
   o rotar la clave, porque la meta-data se escribe en `AndroidManifest.xml`
   durante el prebuild:

   ```bash
   npx expo prebuild --clean --platform android
   grep -c "com.google.android.geo.API_KEY" android/app/src/main/AndroidManifest.xml
   bunx expo run:android
   ```

   El `grep` debe imprimir `1`; no pegues el valor del manifest en ningún
   reporte. Si después de `--clean` el `signingReport` devuelve otra SHA-1,
   actualiza la restricción de la clave en Google Cloud antes de reintentar.

6. Ejecuta el smoke R6 de
   `specs/android-maps-api-key/requirements.md`: con el backend local arriba,
   inicia sesión y abre el tab **Map**; confirma que monta sin crash y que la
   vista nativa del mapa existe — el watermark "Google" es visible. Revisa
   `adb logcat`: no deben aparecer `IllegalStateException: API key not found`,
   `addViewAt: failed to insert view`, `Authorization failure` ni
   `API_KEY_ANDROID_APP_BLOCKED`; si salen los dos últimos, repite los pasos
   2–3 porque no coinciden package y SHA-1. Después ejecuta el smoke R9 de
   `specs/pet-lost-mode/requirements.md`. Registra el resultado, sin la clave,
   en `progress/impl_android-maps-api-key.md`.

   Que el mapa pinte tiles, marker y polyline **no** forma parte de R6 desde
   la acotación del 2026-08-28. El discriminador de #54 confirmó que
   `onMapReady` sí dispara y aisló un defecto independiente de composición
   de la superficie nativa bajo Fabric, rastreado en
   `android-map-never-ready`.

Para un futuro EAS Build, crea la variable por separado:

```bash
eas env:create --name GOOGLE_MAPS_API_KEY_ANDROID --visibility secret --environment development
```

Además exige añadir `"environment": "development"` al perfil `development`
de `eas.json`. Este plumbing de EAS queda **documentado, no implementado ni
verificado** en esta feature.

### Feature 54 — android-map-never-ready

Este smoke es el gate humano R8. Requiere un dispositivo Android real, el
backend local arriba y `mobile-pet-tracker/.env` con
`GOOGLE_MAPS_API_KEY_ANDROID` y `EXPO_PUBLIC_API_URL` apuntando a la IP LAN.
Regenera e instala el dev build porque `expo-maps` no está disponible en Expo
Go:

```bash
cd mobile-pet-tracker
npx expo prebuild --clean --platform android
grep -c "com.google.android.geo.API_KEY" android/app/src/main/AndroidManifest.xml
bunx expo run:android
```

El `grep` debe imprimir `1`; no copies el valor del manifest a ningún
reporte.

Si ya tienes el dev build de esta branch instalado y solo revalidas el fix del
ancestro opaco (fix 1, commits `74f50f7`–`4468da9`), sáltate el bloque anterior:
ese cambio es solo JS y basta `bunx expo start --dev-client` con Fast Refresh.
El `prebuild` completo solo hace falta si cambian dependencias nativas o la
clave de Maps.

Después verifica y registra, sin incluir la clave:

1. Inicia sesión y abre el tab **Map** con una mascota premium que tenga
   última posición y al menos un viaje del día.
2. En **tema claro**, confirma por separado:
   - **tiles**: se ven calles y etiquetas, no solo el watermark "Google";
   - **marker**: se ve el pin de la última posición;
   - **polyline**: se ve la traza del día.
3. Desde **Profile**, cambia a **tema oscuro**, vuelve a Map y confirma que el
   mapa se ve oscuro y que siguen visibles tiles, marker y polyline.
4. Comprueba en `adb logcat` que no haya `Authorization failure`,
   `API_KEY_ANDROID_APP_BLOCKED` ni excepciones de `expo-maps`.
5. Confirma que la tarjeta de stats y el botón **Lost Mode** siguen
   funcionando encima del mapa.

"Monta sin crash y hay watermark" **no cierra R8**: ese es el estado
defectuoso. Se necesita confirmación explícita de tiles, marker y polyline en
ambos temas. Si el encuadre necesita ajuste, cambia solo `MAP_ZOOM` (R2).
Registra el resultado humano en `progress/impl_android-map-never-ready.md`;
ninguna suite Jest ni este implementer pueden cerrar R8.

### Feature 55 — mobile-map-zoom-controls

Este smoke es el gate humano R3. Requiere el dev build de Android de #54 ya
instalado, el backend local arriba y una mascota premium con última posición y
al menos un viaje del día. El cambio es solo JS: no ejecutes `prebuild` ni
`run:android`; basta Fast Refresh sobre el dev build existente:

```bash
cd mobile-pet-tracker
bunx expo start --dev-client
```

Abre el tab **Map** y confirma por separado:

1. La esquina inferior derecha no muestra los controles nativos `+` / `−`.
2. El pinch con dos dedos acerca el mapa y el pinch inverso lo aleja.
3. Siguen visibles tiles, marker y polyline; la tarjeta `map-stats` y el botón
   **Lost Mode** siguen funcionando encima del mapa.

Registra el resultado en `progress/impl_mobile-map-zoom-controls.md` y marca
la casilla R3 en la spec. La suite Jest de `PetMap` usa una vista mockeada:
solo prueba que `uiSettings` llega a `GoogleMaps.View`; no prueba que los
botones desaparezcan ni que el gesto funcione en el dispositivo.

### Feature 57 — localstack-presigned-url-lan-host

Este smoke es el gate humano R6. Requiere LocalStack y el backend local
arriba, un dispositivo Android físico en la misma LAN y el dev build con
`EXPO_PUBLIC_API_URL` apuntando a la IP LAN de la máquina de desarrollo.

En el `.env` raíz define el endpoint con esa misma IP y reinicia el backend
para que `ConfigService` vuelva a leerlo:

```bash
AWS_PRESIGN_ENDPOINT_URL=http://<IP LAN>:4566
docker compose up -d localstack
pnpm -C backend-pet-tracker run start:dev
```

Sustituye `<IP LAN>` por el valor real; no copies literalmente el placeholder.
Después confirma y registra **por separado** estos cuatro resultados:

1. Pide una URL de foto mediante la API (un `uploadUrl` o el `photoUrl` del
   perfil) y comprueba que su host es `<IP LAN>:4566`, nunca `localhost:4566`.
2. Con una URL GET prefirmada vigente, desde la máquina de desarrollo ejecuta:

   ```bash
   curl -fsS "<url firmada>" -o /dev/null
   ```

   Debe salir con exit 0: LocalStack responde en la interfaz LAN y la firma
   sigue siendo válida con ese header `Host`.
3. En el dispositivo físico, sube una foto de mascota desde la app y confirma
   que se muestra después. Este paso prueba por separado la URL PUT y la GET.
4. Limpia logcat antes del flujo y revisa después que ExpoImage no intentó
   conectar con el loopback del teléfono:

   ```bash
   adb logcat -c
   # Repetir en la app la subida y carga de la foto.
   adb logcat -d | rg 'ConnectException.*(localhost|127\.0\.0\.1):4566'
   ```

   El último `rg` debe salir sin coincidencias (exit 1 esperado).

Si la firma lleva el host LAN pero `curl` o el teléfono no conectan, confirma
que `docker-compose.yml` publica `4566:4566` — Docker lo expone en `0.0.0.0` —
y que el firewall de Windows permite entrada TCP al puerto 4566, igual que ya
debe permitirla al 3000 de la API. Al cambiar de red puede cambiar la IP LAN:
actualiza tanto `AWS_PRESIGN_ENDPOINT_URL` en el `.env` raíz como
`EXPO_PUBLIC_API_URL` en `mobile-pet-tracker/.env`, y reinicia backend y Metro.
Para un emulador Android se puede usar `http://10.0.2.2:4566`; eso no sustituye
el smoke obligatorio en dispositivo físico.

Registra el resultado en
`progress/impl_localstack-presigned-url-lan-host.md` y solo entonces marca la
casilla R6 en la spec. R4 verde prueba la firma en memoria, pero no cierra este
gate de red/dispositivo.

### Feature 58 — auth-email-delivery

Esta verificación modifica servicios externos, DNS de producción y envía
correo real. La ejecuta exclusivamente una persona; el implementer y el
reviewer automático no crean cuentas, claves ni registros. Usa valores propios
en los placeholders y no copies claves, dominios privados ni tokens al
repositorio o al reporte.

1. **G1 — verificar un subdominio dedicado en Resend.**

   - Crea la cuenta de Resend y añade como dominio un subdominio dedicado
     elegido por el humano, nunca el dominio raíz.
   - Copia literalmente desde Resend al panel DNS de Hostinger los tres
     registros mostrados: MX y TXT SPF bajo `send.<subdominio>`, y TXT DKIM
     bajo `resend._domainkey.<subdominio>`.
   - No crees, borres ni edites el MX ni el TXT `v=spf1` de la raíz.
   - Espera hasta que Resend marque el subdominio como verificado y registra
     solo el resultado, sin copiar valores DKIM al reporte.

2. **G2 — guardar la API key solo en el entorno.**

   - Crea en Resend una clave con el alcance mínimo necesario para enviar.
   - En el `.env` gitignoreado de la raíz configura
     `EMAIL_ENABLED=true`, `RESEND_API_KEY=<clave creada en Resend>` y
     `RESEND_FROM="Pet Tracker <no-reply@<subdominio>>"`.
   - No pongas el valor real en `.env.example`, documentación, terminal
     compartida ni commits. `git status --short -- .env` no debe mostrar el
     fichero.

3. **G3 — completar los dos envíos reales de extremo a extremo.**

   - Levanta la infraestructura y el backend con
     `docker compose up -d` y
     `pnpm -C backend-pet-tracker run start:dev`.
   - Con una dirección propia ya registrada, ejecuta
     `POST /v1/auth/forgot-password`; debe responder exactamente
     `200 {"requested":true}`. Confirma que el correo llega a inbox, no a
     spam, y usa su token una sola vez en
     `POST /v1/auth/reset-password` hasta obtener
     `200 {"reset":true}`.
   - Registra otra dirección propia mediante `POST /v1/auth/register`.
     Confirma que el correo de verificación llega a inbox y usa su token una
     sola vez en `POST /v1/auth/verify-email` hasta obtener
     `200 {"verified":true}`.
   - No copies direcciones, tokens ni cuerpos de correo al reporte; anota solo
     status HTTP, recepción en inbox y resultado del consumo.

4. **G4 — comprobar que el buzón de Hostinger sigue vivo.**

   - Después del cambio DNS, envía un correo desde el buzón humano existente
     de Hostinger a otra cuenta controlada y confirma su recepción.
   - Responde desde esa segunda cuenta y confirma que el buzón de Hostinger
     recibe la respuesta. Este round-trip demuestra que G1 no degradó el
     correo de la raíz.

El humano registra G1, G2, G3-reset, G3-verificación y G4 como confirmados, con
fecha, en `progress/impl_auth-email-delivery.md`, sin secretos ni tokens. El
reviewer no aprueba la feature mientras cualquiera de ellos siga pendiente.

### Feature 59 — auth-reset-deep-link

Estos cuatro gates los ejecuta una persona, en orden. Requieren el dev build
de Android; Expo Go no puede validar App Links. Sustituye los placeholders
solo en los entornos indicados y nunca copies el dominio real, fingerprints,
direcciones de correo, contraseñas ni tokens al reporte.

1. **G1 — obtener y publicar el fingerprint SHA-256 del dev build.**

   El dev build local (`npx expo run:android`) se firma con el keystore que
   genera el prebuild en `mobile-pet-tracker/android/app/debug.keystore`, no
   con `~/.android/debug.keystore` de Android Studio. Desde
   `mobile-pet-tracker/android` ejecuta:

   ```bash
   keytool -J-Duser.language=en -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

   En Windows usa `app\debug.keystore` (PowerShell y cmd no expanden `~`
   para programas externos). El flag `-J-Duser.language=en` evita el
   `MissingFormatArgumentException` con locale español. Alternativa:
   `gradlew signingReport` (`gradlew.bat` en Windows) y lee la variante
   `debug`.

   Copia el valor `SHA256` completo, no el `SHA1`, y sustituye
   `REPLACE_WITH_DEV_BUILD_SHA256` en
   `hosting/.well-known/assetlinks.json`. Debe conservar los 32 pares
   hexadecimales separados por `:` y el fichero debe seguir conteniendo un
   único statement para `com.trackermex.pettracker`.

2. **G2 — subir los artefactos estáticos a Hostinger.**

   Sube el contenido de `hosting/` tal cual a `public_html/`, incluida la
   carpeta oculta `.well-known`. Con el host real sustituido localmente en los
   comandos, confirma:

   ```bash
   curl -fsSI https://<RESET_LINK_HOST>/.well-known/assetlinks.json
   curl -fsS 'https://<RESET_LINK_HOST>/reset-password?token=TEST_ONLY'
   ```

   La primera ruta debe responder 200 con `Content-Type: application/json` y
   la segunda debe servir la página fallback. Su carga no debe efectuar
   ninguna petición adicional ni consumir el token de prueba.

3. **G3 — configurar el mismo host en backend y móvil.**

   Define `RESET_LINK_HOST=<host real>` tanto en el `.env` gitignoreado de la
   raíz como en `mobile-pet-tracker/.env`. Usa solo el host pelado: sin
   `https://`, path ni slash final. Reinicia el backend para recargar
   `ConfigService` y regenera el dev build de Android para que el intent
   filter quede escrito en la aplicación. Ninguno de los dos `.env` se
   commitea.

4. **G4 — smoke completo y de un solo uso.**

   - Con el backend levantado y una cuenta propia, ejecuta un
     `POST /v1/auth/forgot-password`; debe responder 200 y el correo debe
     llegar con el enlace HTTPS.
   - Abre el enlace dos veces antes de enviar el formulario. Las dos aperturas
     deben entrar en `/reset-password` del dev build con el token intacto; no
     debe existir petición de reset durante el montaje.
   - Completa el formulario una vez y confirma el 200. Reabre el mismo enlace
     e intenta repetirlo: el segundo `POST /v1/auth/reset-password` debe
     responder 400.
   - Confirma que el login con la contraseña anterior responde 401 y con la
     nueva responde 200.
   - En un dispositivo o perfil sin la app instalada, abre el enlace y
     confirma que aparece la página fallback de Hostinger.

Registra únicamente los resultados y status en
`progress/impl_auth-reset-deep-link.md`. G1–G4 siguen pendientes hasta esa
confirmación humana; las suites automáticas no los sustituyen.

---

## Notas para el implementer

- No declares done solo porque el build pasa. Prueba los casos edge (errores,
  permisos, condiciones límite).
- Los scripts de verificación manual (curl, CLI, etc.) no sustituyen a los
  tests automáticos exigidos por la disciplina TDD.
- Si alguna verificación falla, documenta por qué en `progress/impl_<feature>.md`
  antes de reportar al leader.
