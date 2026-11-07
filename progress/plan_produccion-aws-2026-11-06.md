# Plan: backend en producción en AWS y borrado de cuenta (2026-11-06)

El humano presenta la app el miércoles 2026-11-11 y quiere que ese día el backend ya
corra en producción en AWS. Además pide dos cosas para las tiendas: tolerancia a la
caída de una región entera y borrar la cuenta desde la app. Este plan registra #245–#249.

## 0. Estado de partida

- `dev` en `aacfab9a`. Todo el producto está mergeado. Siguen pendientes #230 (G2 iOS) y la
  deuda P3 (#60, #129, #144, #150, #154, #160, #163–#165, #192).
- El backend solo corre en local. `infra/` tiene un único stack, `PetTrackerDev` en us-east-1,
  con SQS, DynamoDB, S3 y EventBridge. No hay compute, base de datos, dominio ni HTTPS.
- La arquitectura de `plans/README.md` preveía Lambda con Aurora Data API. El código se
  apartó de ella: usa un `Pool` de `pg` (`backend-pet-tracker/src/db/drizzle.module.ts`) y
  corre los workers en el mismo proceso. Llevarlo a Lambda ya no es solo empaquetar.
- Ni el backend ni el móvil permiten borrar la cuenta. `users.controller.ts` solo tiene
  GET, PATCH y push-tokens.

## 1. Decisiones del humano (2026-11-06)

Texto literal del humano:

> Pues la idea es que ya emepecemos a trabajar el dia de la presentacion el backend ya este
> en produccion AWS, pensemos como senior para AWS ya tenemos la arquitectura para debemos
> de tener en cuenta que debe de ser escalable, prevenir que la caia de regiones tenemos que
> despligar en otra region en caso de que una se caiga, igual tenia en cuenta que nos falta
> borrar la cuenta desde la app tenemos editar podemos ponerlo ahi

Respuestas del humano:

| Pregunta | Respuesta literal | Lo que significa |
|---|---|---|
| Compute para producción | «ECS Fargate (Recommended)» | El NestJS actual en un contenedor. Hay dos servicios con la misma imagen: la API, con autoescalado y detrás de un ALB con HTTPS, y los workers, con 1 tarea y `POLLER_ENABLED=true`. Se acepta un costo fijo mensual por encima del presupuesto Lambda de `plans/presupuesto-produccion.md`. |
| Estrategia ante la caída de una región | «Pilot light (Recommended)» | Los datos se replican de forma continua a la segunda región: Aurora Global Database, DynamoDB global table y S3 CRR. Allí el compute queda a 0, y Route 53 conmuta el tráfico. Objetivo: RTO de 15 a 30 min y RPO de segundos. Aurora Global no permite pausa automática, así que la réplica queda encendida a 0.5 ACU como mínimo. |
| Par de regiones | «mx-central-1 + us-east-2» | Primaria en México (Central) y respaldo en Ohio. Dev se queda en us-east-1. |
| Firma de las specs | «Extender firma delegada» | El leader firma #245–#249 con la checklist del §4. Las PRs van a `dev`. |
| Dónde se borra la cuenta | «tenemos editar podemos ponerlo ahi» | La acción va en la pantalla Editar perfil (`src/screens/edit-profile/index.tsx`). |

Lo que el leader verificó en la documentación de AWS (2026-11-06) para mx-central-1:

- Aurora PostgreSQL Serverless v2 está disponible a partir de 16.4, 17.4 y 18.3
  ([tabla](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.Aurora_Fea_Regions_DB-eng.Feature.ServerlessV2.html)).
- Aurora Global Database con PostgreSQL está disponible a partir de 16.1, 17.4 y 18.3
  ([tabla](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.Aurora_Fea_Regions_DB-eng.Feature.GlobalDatabase.html)).
- Fargate está disponible ([tabla](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate-Regions.html)).
- También están ECS, ECR, ALB, ACM, Route 53, DynamoDB, SQS, EventBridge, S3, Secrets Manager,
  KMS, Backup, CloudWatch y NAT Gateway (tabla pública de servicios por región).

Conclusión: el motor será Aurora PostgreSQL 17 (17.4 o posterior). La 16.4 también valdría
en mx-central-1, pero local corre Postgres 17 (riesgo 13 de la explore): con 17 no hay
divergencia. La spec de #246 verifica que `aws-cdk-lib` 2.263.0 trae el enum de la versión.

### Decisiones técnicas del leader sobre la explore (2026-11-06)

`progress/explore_produccion-aws.md` dejó 17 decisiones abiertas. Las técnicas sin costo las
cierra el leader. Las de costo o de producto pasan al §5 (D2, D4).

| # explore | Decisión | Feature |
|---|---|---|
| 1 | Migraciones con el migrator runtime de `drizzle-orm` desde un script compilado; los `.sql` se copian a la imagen. Se ejecutan como tarea única de ECS con la misma imagen y otro comando, y la lanza el humano (GA4) | #245 contrato, #246 task definition |
| 2 | La credencial de Aurora la genera CDK en Secrets Manager. La tarea recibe `PGHOST`, `PGPORT`, `PGDATABASE` y `PGUSER` como entorno, y `PGPASSWORD` como secreto de ECS. Fuera de producción, `DATABASE_URL` sigue funcionando. Sin IAM auth | #245, #246 |
| 3 | TLS con el bundle global de CA de RDS dentro de la imagen y `NODE_EXTRA_CA_CERTS`, con verificación del certificado | #245 |
| 4, 5 | El dispatcher de recordatorios sigue en proceso. El servicio de workers despliega con `minHealthyPercent: 0` y `maxHealthyPercent: 100`: nunca hay dos tareas vivas. EventBridge Scheduler no vuelve | #246 |
| 7 | `trust proxy` en la API. El límite de correo sigue en memoria por tarea. Se acepta: con N tareas el límite efectivo es N veces el nominal. Queda como deuda | #245 |
| 8 | El apagado ordenado (shutdown hooks y cierre del pool) y los logs en JSON de una línea entran en #245. Si un tick del dispatcher sigue vivo al vencer el drenaje, se abandona y puede reenviar un recordatorio en la tarea siguiente. Se acepta como deuda | #245 |
| 9 | El ALB y ECS usan un liveness que no toca la base. `/v1/health`, que sí la toca, queda para el health check de Route 53 en #249 | #245, #246 |
| 10 | Aurora 17 (ver arriba) | #246 |
| 11 | Imagen x86_64: `cdk deploy` construye la imagen en la máquina del humano. arm64 se deja para cuando haya pipeline | #245, #246 |
| 12 | La versión de Node se fija en la imagen base: Node 24, la misma que en CI | #245 |
| 13–15 | Endpoint global de escritura, bucket réplica y `JWT_SECRET` replicado | #249 |
| 16 | Disponibilidad ya verificada en el §1 | — |
| 17 | Validación de la configuración al arrancar: un flag activo sin su clave aborta, y `SIM_MODE` debe venir explícito. Qué integraciones van en real el miércoles es D4 | #245 valida, #246 fija los valores |
| 6 | Salida a internet | D2 (§5) |

Además, en #245: el entrypoint correcto es `dist/src/main.js` (riesgo 1 de la explore), el pool
lleva `max` explícito (riesgo 11) y ningún `.env` entra en la imagen (riesgo 4).

## 2. Features

### 245 `backend-container-image` (P0, @Backend)

El backend tiene que poder correr en Fargate. La explore
`progress/explore_produccion-aws.md` fija el inventario. Alcance previsto:

- `Dockerfile` multi-stage con una imagen final sin herramientas de build y usuario no root;
- endpoint de health para el ALB y para Route 53;
- apagado ordenado con SIGTERM;
- migraciones ejecutables como tarea única de ECS (no hay seeds: el catálogo de vacunas va en la migración 0023), y también `provision-device` y `set-device-subscription`, para dar de alta los collares reales que pide D4;
- validación de la configuración al arrancar;
- TLS hacia Aurora con el CA de RDS;
- en AWS real, uso de las credenciales del task role, sin endpoint de LocalStack.

La spec fija el contrato que consume #246: ruta del Dockerfile, puerto, ruta de health,
comando de migración y variables de entorno.

### 246 `infra-prod-region-stack` (P0, @Backend)

Stack CDK de producción parametrizado por región. El parámetro de rol
(`primary` | `standby`) pasa a #249, que es quien lo necesita: la spec de #246 lo difiere
(firma del 2026-11-06). El miércoles se despliega solo en mx-central-1. Contiene:

- **Red:** una VPC con 3 AZ.
- **Compute:**
  - un cluster ECS;
  - un servicio Fargate de API detrás de un ALB con HTTPS (ACM) y autoescalado;
  - un servicio Fargate de workers con 1 tarea en `primary` y 0 en `standby`.
- **Base de datos:** Aurora PostgreSQL 17 (17.4 o posterior) Serverless v2 con escritor y lector en AZ distintas.
- **Datos y mensajería:**
  - DynamoDB `positions` en modo on-demand (decisión del leader: sin capacidad que dimensionar) con PITR, declarada para poder sumar réplicas (#249);
  - las colas SQS y sus DLQ;
  - el bus y la regla de EventBridge;
  - el bucket S3 de media, versionado, cifrado y con acceso público bloqueado.
- **Secretos y alarmas:**
  - secretos referenciados por nombre, que los crea el humano (GA2);
  - alarmas de CloudWatch: 5xx del ALB, targets no sanos, profundidad de las DLQ y CPU/ACU de Aurora.

Cada recurso lleva su test de `aws-cdk-lib/assertions` y `cdk synth` en verde. Depende del
contrato de #245, no de su merge: la spec lo cita.

### 247 `users-account-deletion-api` (P1, @Backend)

`DELETE` del usuario autenticado. Borra o anonimiza todos sus datos en Postgres, S3 y los
tokens de push, e invalida sus sesiones. La explore `progress/explore_account-deletion.md`
mapea los datos. Qué pasa con las mascotas que comparte con otros miembros es la decisión
abierta D3 (§5).

Decisiones técnicas del leader sobre `progress/explore_account-deletion.md` (2026-11-06):

| Decisión de la explore | Elección | Motivo |
|---|---|---|
| D-HTTP | `DELETE /v1/me` con cuerpo `{ password }` y 204. Contraseña incorrecta: 403, nunca 401, porque el móvil cierra sesión con 401 | Contrato de #248 |
| D-PWD | Opción (1): la contraseña va en el cuerpo y se verifica con `PasswordHasher` | No hay login social, así que todo usuario tiene contraseña. No se recorta la reautenticación |
| D-HARD | Opción (1): borrado duro inmediato | Es lo más simple y cumple Apple 5.1.1(v) y Google sin interpretación |
| D-FK | Opción (1): migración a `on delete set null` en las cinco FKs `created_by`, con columnas nullable | Conserva el historial de los demás miembros y desbloquea el 23503 |
| D-JWT | Opción (2): el guard comprueba que el usuario existe (una consulta por PK) y responde 401. Es una enmienda a R8 del guard | Se arregla en un solo sitio: el segundo dispositivo cierra sesión por el camino que ya existe |
| D-EXT | Opción (1): purga inmediata tras el commit de S3 (prefijos `pets/<petId>/`) y DynamoDB (`PET#<petId>`), *best effort* y con registro del prefijo para reintentar. Vive en el borrado de mascota, así que también el borrado suelto de una mascota deja de dejar huérfanos | Las posiciones revelan dónde vive el usuario |
| D-AUD | Opción (1): se mantiene el uuid, que ya es pseudónimo sin la fila de `users`, y se registra `user.delete` | Sin migración de `audit_log` |
| D-RET | #246 fija la retención: backups de Aurora 7 días, PITR de DynamoDB 35 días (fijo en AWS) y expiración de versiones no actuales de S3 a 30 días. La política de privacidad del sitio web lo declara | Va al sitio web (@Frontend) por el humano |

Lo que esto pide a #246: el task role de la API suma `s3:ListBucket`, `s3:DeleteObject`,
`dynamodb:Query` y `dynamodb:BatchWriteItem`, y el bucket una regla de ciclo de vida para las
versiones no actuales.

### 248 `mobile-account-deletion` (P1, @Backend)

En Editar perfil: una acción destructiva «eliminar cuenta» con confirmación. Llama al API de
#247, cierra la sesión (secure-store y caché) y vuelve a la bienvenida. El copy y, si hace
falta, el artboard son G1, del humano. La hace @Backend porque @Frontend está con el diseño
del sitio web.

### 249 `infra-prod-dr-standby` (P1, @Backend; después de la presentación)

Pilot light en us-east-2:

- clúster secundario de Aurora Global Database;
- réplica de la tabla DynamoDB;
- replicación de S3 (CRR) y de ECR;
- réplica de los secretos;
- el parámetro de rol (`primary` | `standby`) en el stack de #246, diferido desde su spec,
  y ese stack desplegado como `standby`;
- registros failover de Route 53 con health check sobre la API primaria;
- `docs/runbook-failover.md` con la conmutación y la vuelta;
- the lock on the #246 execution roles. Observation O2 of
  `progress/review_infra-prod-region-stack.md` found that a `secretsmanager:*` statement
  on `'*'`, or `AdministratorAccess` on the api execution role, passes the 50 tests. The
  reason is that `secretsReadBy` only reads statements with
  `secretsmanager:GetSecretValue`, and R10, R14 and R16 do not pin `ManagedPolicyArns`.
  The current code is correct. The #249 spec should close this gap with one of two
  requirements: either extend `secretsReadBy` to `secretsmanager:*` and `*`, or require
  `ManagedPolicyArns` to be absent on the three execution roles.

El poller de Wialon solo corre en la región activa, para no ingerir dos veces. El simulacro
de conmutación es GA7, del humano.

## 3. Calendario hacia el miércoles

| Día | Leader e IAs | Humano |
|---|---|---|
| Vie 6 | Plan; explores de producción y de borrado; specs de #245–#248 | Contesta D1–D3 (§5) |
| Sáb 7–Dom 8 | Firma delegada; Codex en #245 y #246 en paralelo (`backend-pet-tracker/` frente a `infra/`); después #247 y #248 | GA1: dominio, zona y certificado |
| Lun 9 | Reviews y merges a `dev` | GA2 secretos, GA3 `cdk bootstrap` + `cdk deploy` mx-central-1, GA4 migraciones y alta de los collares reales |
| Mar 10 | Apoyo al smoke | GA5 smoke contra producción; la app apunta a `https://api.<dominio>`; ensayo |
| Mié 11 | — | Presentación. **Plan B:** el backend local de siempre, listo en el PC |
| Semana del 16 | #249 | GA3 en us-east-2, GA7 simulacro de failover |

Es un calendario justo. El riesgo principal está en GA1–GA4 del lunes: si el certificado o
el deploy se atascan, la demo va con el plan B.

## 4. Ciclo por feature

Idéntico a `plan_mejoras-smoke-2026-11-03.md` §4. En el commit de firma va:
`chore(spec): firma delegada #<id> (mandato del humano 2026-10-23, ampliado 2026-11-06)`.

A la checklist de firma se le suman tres puntos:

1. Ningún paso del handoff ni del test toca AWS real. Las pruebas de infra son `cdk synth`
   y assertions, nunca `deploy`.
2. Ningún secreto en el repo ni en el handoff. Se nombran los secretos, no sus valores.
3. Cada recurso con estado (Aurora, DynamoDB, S3) declara su `removalPolicy` y su protección
   contra borrado, y un test lo fija.

## 5. Gates humanos y decisiones abiertas

| Gate | Qué | Cuándo | Casilla |
|---|---|---|---|
| D1 | Dominio de la API y si la zona está en Route 53. #246 recibe el dominio y el ARN del certificado como contexto de despliegue (`cdk deploy -c`), así que D1 no bloquea su firma; la zona en Route 53 sí la necesita #249 para el failover | Antes de GA1 | este plan |
| D2 | Salida a internet de las tareas: NAT por AZ, un solo NAT, o subredes públicas con IP pública y SG cerrado | Antes de firmar #246 | este plan |
| D3 | Borrado de cuenta con mascotas compartidas | Antes de firmar #247 | este plan |
| D4 | Qué integraciones van en real en producción el miércoles: Wialon (`SIM_MODE`), push, correo con Resend (exige verificar el dominio por DNS) e IA con Anthropic (costo por uso) | Antes de firmar #246 | este plan |
| G1 | Copy y, si hace falta, artboard de #248 | Antes de firmar #248 | `specs/mobile-account-deletion/requirements.md` |
| GA1 | Dominio, zona hospedada y certificado ACM | Antes de GA3 | este plan |
| GA2 | Crear en Secrets Manager los secretos que nombra #246 | Antes de GA3 | este plan |
| GA3 | `cdk bootstrap` y `cdk deploy` (mx-central-1; us-east-2 con #249) | Lunes 9 | este plan |
| GA4 | Migraciones en producción y alta de los collares reales (`provision-device`, `set-device-subscription`) como tareas únicas de ECS | Tras GA3 | este plan |
| GA5 | Smoke contra producción | Martes 10 | este plan |
| GA6 | Alarma de presupuesto en AWS Budgets | Con GA3 | este plan |
| GA7 | Simulacro de failover a us-east-2 | Con #249 | este plan |
| G2 | Smoke en dispositivo de #248 | En lote, al final | `progress/smoke_produccion.md` |
| G5 | Mergear `dev` → `main` | Cuando el humano dé la app por lista | PR en GitHub |

- [x] D1 (fecha: 2026-11-06): «Zona en Route 53». Nombre del dominio pendiente; llega como
  contexto de despliegue. Con la zona en Route 53 (se asume en la misma cuenta), #246 crea el
  certificado con validación DNS y el registro alias hacia el ALB. GA1 se reduce a dar el
  nombre del dominio y el id de la zona.
- [x] D2 (fecha: 2026-11-06): «Subredes públicas (Recommended)». Tareas con IP pública y SG
  sin entrada salvo desde el ALB; Aurora en subredes aisladas; endpoints gateway de S3 y
  DynamoDB. Sin NAT.
- [x] D3 (fecha: 2026-11-06): «Borrarla para todos». Las mascotas de las que el usuario es
  owner se borran aunque tengan otros miembros. La confirmación de #248 lo advierte. Avisar
  por push a los demás miembros queda fuera de alcance.
- [x] D4 (fecha: 2026-11-06): «Correo (Resend), IA (Anthropic), Notificaciones push, Wialon
  real (collares)». En producción: `SIM_MODE=false`, `PUSH_ENABLED=true`,
  `EMAIL_ENABLED=true`, `ANTHROPIC_ENABLED=true`. GA2 crea el token de Wialon y las claves de
  Resend y Anthropic. GA1 suma verificar el dominio en Resend (SPF y DKIM en la zona).
- [ ] GA1 (fecha: ____)
- [ ] GA2 (fecha: ____)
- [ ] GA3 mx-central-1 (fecha: ____)
- [ ] GA3 us-east-2 (fecha: ____)
- [ ] GA4 (fecha: ____)
- [ ] GA5 (fecha: ____)
- [ ] GA6 (fecha: ____)
- [ ] GA7 (fecha: ____)

Ninguna IA lanza `cdk deploy`, `cdk bootstrap` ni `eas build`, ni toca la cuenta AWS real.

## 6. Fuera de alcance

- Migrar a Lambda: se descartó en el §1.
- Pipeline de deploy en CI. El humano despliega con `cdk deploy`, que construye la imagen
  con `ContainerImage.fromAsset`. Se añadirá cuando desplegar a mano estorbe.
- Perfiles de release en `eas.json`, la ficha de las tiendas, #60 (iOS) y el sitio web
  (lo lleva @Frontend). Van en el plan de tiendas.
- Activo-activo multi-región.
