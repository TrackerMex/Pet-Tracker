---
feature: "infra-prod-region-stack"
status: approved     # draft | approved
tags: [harness, spec, infra, produccion]
---

# Trazabilidad — [[infra-prod-region-stack]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `infra/test/build-app.test.ts::#246 R1: devuelve la misma app con solo PetTrackerDev en us-east-1`<br>`infra/test/build-app.test.ts::#246 R1: BACKEND_IMAGE_DIRECTORY es backend-pet-tracker del repo`<br>`infra/test/build-app.test.ts::#246 R1: bin/app.ts delega en buildApp` | `c34cafe217e317e8664dc8ab427c6050acf5836a` (rojo) + `574e7a5595469b1e4f3c4b3b4e90a97ac2407b53` (verde): `feat(infra-prod-region-stack): compose the CDK app in buildApp (R1)` |
| R2 | `infra/test/build-app.test.ts::#246 R2: solo apiDomain`<br>`infra/test/build-app.test.ts::#246 R2: sin alarmEmail ni resetLinkHost`<br>`infra/test/build-app.test.ts::#246 R2: resendFrom en blanco`<br>`infra/test/build-app.test.ts::#246 R2: hostedZoneId numérico` | `6c68a3acfc940bb9354af3a19bfb725b79c45428` (rojo) + `75d7f2dc033b36aca08eb00cc8c50902dc5d9471` (verde): `feat(infra-prod-region-stack): reject partial prod context (R2)` |
| R3 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R3: lanza fuera de la zona y no lanza dentro` | `4c9a0ff07e5b1671ffa35aed7ab6022db89b2994` (rojo) + `bcb64bcf8afef6c4b9435aa0f27d176bd09fe11b` (verde): `feat(infra-prod-region-stack): validate apiDomain against the hosted zone (R3)` |
| R4 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R4: red de mx-central-1`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R4: red de us-east-2` | `fdc0fa21e40a40e5f5c7e8c0a0068b0dc078190a` (rojo) + `3a867e38641651bc3eaacb0b24a14078d46d8416` (verde): `feat(infra-prod-region-stack): add the NAT-less VPC (R4)` |
| R5 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R5: seis colas, redrive, retención de DLQ, bus, regla y política` | `35f03d587b98645b8f36c9b15ea505379dbc0bc9` (rojo) + `4bc8c2b20712fb390d90e5d6e89b883a4ee35522` (verde): `feat(infra-prod-region-stack): add queues, event bus and rule (R5)` |
| R6 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R6: GlobalTable de una réplica, Retain y sin KMS` | `2b3d9141c0b943d4f2754fb0a55919d3f7009804` (rojo) + `c7263759d02435c3fa1e18e7399202e54c1c4985` (verde): `feat(infra-prod-region-stack): add the positions table (R6)` |
| R7 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R7: bucket de mx-central-1`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R7: bucket de us-east-2` | `d495af11b962f1b555df5ab8e2510b8e62959f7d` (rojo) + `9caab615d4ac3fce427b759ca4c28b38bad77680` (verde): `feat(infra-prod-region-stack): add the media bucket (R7)` |
| R8 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R8: Aurora de mx-central-1`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R8: Aurora de us-east-2` | `12bab1392f33bc016da6cc66ea4d865abd041ea0` (rojo) + `113257f3f4b3a941cb039b9b79ed1bec72b50f66` (verde): `feat(infra-prod-region-stack): add Aurora Serverless v2 (R8)` |
| R9 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R9: balanceador, certificado, registro, listeners y target group`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R9: servicio API y su task definition`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R9: grupos de seguridad del servicio y del balanceador`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R9: una sola imagen Docker linux/amd64` | `e24c2c41cce0af60e006f1d5c5fb986ded99a804` (rojo) + `6203b282c46204a0114d5c0be0cb7b92f7579693` (verde): `feat(infra-prod-region-stack): add the API service behind an HTTPS ALB (R9)` |
| R10 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R10: environment exacto`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R10: secretos y lectura del execution role` | `e479454e2d48d37b70e97c37a0f8f4e5645e76d9` (rojo) + `a46b5cb566e95db3544f6e1112239e7e9ecb2e85` (verde): `feat(infra-prod-region-stack): wire the api environment and secrets (R10)` |
| R11 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R11: cuatro sentencias exactas, sin políticas administradas` | `c4190053e7a5929f4d0df04b75c6446bb980b21c` (rojo) + `da9a7fcd8fb2c78a75cd776cce588897c2720ef3` (verde): `feat(infra-prod-region-stack): grant the api its minimal IAM (R11)` |
| R12 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R12: scalable target y política target tracking al 60 %` | `e4c3001cf8ccde492ebe72c6a0bebe5d50add2aa` (rojo) + `98716638feb02e96b3ad88fdd9c6883adb6fcf3b` (verde): `feat(infra-prod-region-stack): autoscale the api on CPU (R12)` |
| R13 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R13: servicio workers, su grupo y la imagen compartida`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R13: task definition workers` | `1623429593c231c0f8a0df6273c1e9d49af6515c` (rojo) + `38b2c90123adce31d37a7deebf31b98656a705fb` (verde): `feat(infra-prod-region-stack): add the singleton workers service (R13)` |
| R14 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R14: environment exacto`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R14: secretos y lectura del execution role` | `f8eb2ca594caa8e1e9434b8412da777812b25474` (rojo) + `56ecf28478b7ac6e62bb8dc6c0ce3277ba0e08f0` (verde): `feat(infra-prod-region-stack): wire the workers environment and secrets (R14)` |
| R15 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R15: cuatro sentencias exactas, sin políticas administradas` | `48320d25e2d43e2613f1f6c6f20d473a49c98bb1` (rojo) + `4ab1919c09d731d9d1041c8b815b13a59fd42aed` (verde): `feat(infra-prod-region-stack): grant workers their minimal IAM (R15)` |
| R16 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R16: TD ops, su contenedor, logs y secretos`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R16: cinco roles de ecs-tasks, todos referenciados, y dos servicios` | `626cd73c572280c9aaa1f9cf8c308a65601e5943` (rojo) + `823eda22eb95b8a5c4bc807a2e7d2c0393408ae5` (verde): `feat(infra-prod-region-stack): add the ops task definition for migrations and one-offs (R16)` |
| R17 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R17: dos reglas de entrada desde grupos, ninguna desde CIDR` | `2b21c8fb9081be567e668db1512b4734a64edf05` (rojo) + `f7815939fe7b6560db23a02a413e821e6c2b4c8d` (verde): `feat(infra-prod-region-stack): open Aurora to the api and workers only (R17)` |
| R18 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R18: topic y suscripción email`<br>`infra/test/pet-tracker-prod-stack.test.ts::#246 R18: ocho alarmas exactas` | `e1cdba418aa1840ff45ef0be3cb29439fe7c69ce` (rojo) + `3171b6ad04026fa6380b773305b56d8423eb4638` (verde): `feat(infra-prod-region-stack): add alarms to an email topic (R18)` |
| R19 | `infra/test/pet-tracker-prod-stack.test.ts::#246 R19: seis outputs con sus valores` | `e94963aa6e1c9bca16ba87b42a6a6e268c632ca5` (rojo) + `0cd592f4cfe7b367c767364297488606d328eaac` (verde): `feat(infra-prod-region-stack): export the operational outputs (R19)` |
| R20 | `infra/test/build-app.test.ts::#246 R20: añade PetTrackerProd-mx-central-1 con los valores del contexto` | `651aa110fa9c9b3d9adeb92406f9862dc2fcb3fd` (rojo) + `1ab0a9da270e75b64d5aed7f16468d39024cc4a7` (verde): `feat(infra-prod-region-stack): add the primary prod stack from context (R20)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: rojo `test(infra-prod-region-stack): <desc> (R<n>)`,
verde `feat(infra-prod-region-stack): <desc> (R<n>)`.
Cada fila lista todos los `it` del requisito (prefijo `#246 R<n>:`) en
`infra/test/build-app.test.ts` o `infra/test/pet-tracker-prod-stack.test.ts`,
y los hashes del rojo y del verde con el mensaje del verde.
El implementer rellena esta tabla en el cierre ([[tasks]] §Cierre paso 7); el
reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5).
