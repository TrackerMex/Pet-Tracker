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

Conclusión: la versión mínima del motor es Aurora PostgreSQL 16.4. La spec de #246 la fija.

## 2. Features

### 245 `backend-container-image` (P0, @Backend)

El backend tiene que poder correr en Fargate. La explore
`progress/explore_produccion-aws.md` fija el inventario. Alcance previsto:

- `Dockerfile` multi-stage con una imagen final sin herramientas de build y usuario no root;
- endpoint de health para el ALB y para Route 53;
- apagado ordenado con SIGTERM;
- migraciones y seeds ejecutables como tarea única de ECS;
- validación de la configuración al arrancar;
- TLS hacia Aurora con el CA de RDS;
- en AWS real, uso de las credenciales del task role, sin endpoint de LocalStack.

La spec fija el contrato que consume #246: ruta del Dockerfile, puerto, ruta de health,
comando de migración y variables de entorno.

### 246 `infra-prod-region-stack` (P0, @Backend)

Stack CDK de producción parametrizado por región y por rol (`primary` | `standby`). El
miércoles se despliega solo en mx-central-1, como `primary`. Contiene:

- **Red:** una VPC con 3 AZ.
- **Compute:**
  - un cluster ECS;
  - un servicio Fargate de API detrás de un ALB con HTTPS (ACM) y autoescalado;
  - un servicio Fargate de workers con 1 tarea en `primary` y 0 en `standby`.
- **Base de datos:** Aurora PostgreSQL Serverless v2 ≥ 16.4 con escritor y lector en AZ distintas.
- **Datos y mensajería:**
  - DynamoDB `positions` con PITR, declarada para poder sumar réplicas (#249);
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
- el stack de #246 con el rol `standby`;
- registros failover de Route 53 con health check sobre la API primaria;
- `docs/runbook-failover.md` con la conmutación y la vuelta.

El poller de Wialon solo corre en la región activa, para no ingerir dos veces. El simulacro
de conmutación es GA7, del humano.

## 3. Calendario hacia el miércoles

| Día | Leader e IAs | Humano |
|---|---|---|
| Vie 6 | Plan; explores de producción y de borrado; specs de #245–#248 | Contesta D1–D3 (§5) |
| Sáb 7–Dom 8 | Firma delegada; Codex en #245 y #246 en paralelo (`backend-pet-tracker/` frente a `infra/`); después #247 y #248 | GA1: dominio, zona y certificado |
| Lun 9 | Reviews y merges a `dev` | GA2 secretos, GA3 `cdk bootstrap` + `cdk deploy` mx-central-1, GA4 migraciones y seeds |
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
| D1 | Dominio de la API y si la zona está en Route 53 | Antes de firmar #246 | este plan |
| D2 | Salida a internet de las tareas: NAT por AZ, un solo NAT, o subredes públicas con IP pública y SG cerrado | Antes de firmar #246 | este plan |
| D3 | Borrado de cuenta con mascotas compartidas | Antes de firmar #247 | este plan |
| G1 | Copy y, si hace falta, artboard de #248 | Antes de firmar #248 | `specs/mobile-account-deletion/requirements.md` |
| GA1 | Dominio, zona hospedada y certificado ACM | Antes de GA3 | este plan |
| GA2 | Crear en Secrets Manager los secretos que nombra #246 | Antes de GA3 | este plan |
| GA3 | `cdk bootstrap` y `cdk deploy` (mx-central-1; us-east-2 con #249) | Lunes 9 | este plan |
| GA4 | Migraciones y seeds en producción | Tras GA3 | este plan |
| GA5 | Smoke contra producción | Martes 10 | este plan |
| GA6 | Alarma de presupuesto en AWS Budgets | Con GA3 | este plan |
| GA7 | Simulacro de failover a us-east-2 | Con #249 | este plan |
| G2 | Smoke en dispositivo de #248 | En lote, al final | `progress/smoke_produccion.md` |
| G5 | Mergear `dev` → `main` | Cuando el humano dé la app por lista | PR en GitHub |

- [ ] D1 (fecha: ____)
- [ ] D2 (fecha: ____)
- [ ] D3 (fecha: ____)
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
