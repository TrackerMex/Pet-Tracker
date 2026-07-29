# Pet Tracker — Presupuesto de servicios en producción

Elaborado: 2026-07-28. Región us-east-1, USD/mes, impuestos no incluidos. Precios verificados en julio 2026. Estimación para decisión de arranque, no cotización en firme.

Versión presentable para el equipo: https://claude.ai/code/artifact/82eafc84-4d2b-4e2d-a228-0ce46d87a6c2

## Resumen

| Concepto | Coste |
|---|---|
| AWS — Lanzamiento (100 collares, 150 usuarios) | $55–85/mes |
| AWS — Crecimiento (1 000 collares, 1 500 usuarios) | $250–400/mes |
| Terceros fijos (EAS + OpenAI + Maps) | $20–40/mes |
| Wialon (plataforma GPS) | $0 — somos partner de Wialon |
| IA de desarrollo (Codex Pro + Claude Max, fase dev ~1 mes hasta demo) | $200–400/mes |
| Pago único/anual (Apple $99/año + Google Play $25) | ~$125 año 1 |

Coste unitario AWS: ≈ $0.70/mascota/mes en Lanzamiento → ≈ $0.30/mascota/mes en Crecimiento.

## Supuestos

- Collar reporta cada 30 s ⇒ 2 880 posiciones/día por collar (peor caso 24 h): 8,6 M posiciones/mes (Lanzamiento), 86,4 M (Crecimiento).
- App: ~160 peticiones/usuario/día (polling del mapa en MVP).
- Telemetría en DynamoDB con TTL 90 días; dominio relacional en Aurora PostgreSQL.
- Dev aparte: < $10/mes (Aurora 0 ACU en reposo + free tier), ya definido en plans/README.

## Backend AWS (mensual)

| Servicio | Lanzamiento | Crecimiento | Nota |
|---|---|---|---|
| Aurora Serverless v2 (PG 16) | $30–50 | $90–140 | $0.12/ACU-h, media 0,5–1 ACU activo, + storage e I/O |
| DynamoDB `positions` on-demand | $8 | $70–90 | $0.625/M escrituras, storage TTL 90d |
| EventBridge bus | $9 | $20–86 | $1/M eventos; ver optimización |
| CloudWatch | $4 | $15–30 | $0.50/GB ingesta de logs |
| Lambda (API + ingesta + workers) | $0–2 | $15–20 | free tier perpetuo cubre casi todo Lanzamiento |
| S3 + CloudFront | $1–3 | $5–15 | fotos y documentos |
| SQS | $1 | $10 | batching x10 |
| API Gateway HTTP | $1 | $7 | $1.00/M peticiones |
| EventBridge Scheduler | <$1 | $1 | recordatorios one-shot |
| Cognito Essentials | $0 | $0 | 10k MAU gratis, luego $0.015/MAU |
| SSM Parameter Store | $0 | $0 | tier estándar |
| **Total** | **$55–85** | **$250–400** | |

WebSocket tiempo real (fase 010, post-MVP): +$5–30/mes según conexiones.

## Terceros (mensual)

| Servicio | Lanzamiento | Crecimiento | Nota |
|---|---|---|---|
| Wialon | $0 | $0 | somos partner de Wialon — confirmar por escrito límites de dispositivos/API |
| OpenAI (GPT-5 mini) | $1–3 | $5–15 | $0.125/M in, $1.00/M out; reglas calculan, IA redacta |
| Google Maps (Geocoding) | $0 | $0–25 | 10k llamadas gratis/mes por SKU + caché de direcciones |
| Expo Push | $0 | $0 | |

## Adicional — IA de desarrollo (mensual, fase dev)

Herramientas del equipo para la primera demo en ~1 mes. Coste de desarrollo, no de operación: bajar de tier o cancelar al pasar a mantenimiento.

| Herramienta | Coste | Nota |
|---|---|---|
| ChatGPT Pro (incluye Codex) | $100–200/mes | tiers 5x ($100) / 20x ($200) |
| Claude Max | $100–200/mes | tiers 5x ($100) / 20x ($200) |
| **Total IA desarrollo** | **$200–400/mes** | empezar en 5x; ambos usan modelo de créditos desde 2026 |

## Frontend (app Expo)

| Concepto | Coste |
|---|---|
| EAS Free (15+15 builds/mes, updates hasta 1k usuarios) → Starter en producción | $0 → $19/mes |
| Apple Developer Program | $99/año |
| Google Play Console | $25 único |
| Google Maps SDK móvil | $0 — confirmar en consola de facturación al activar clave |

Sin hosting web: app 100 % móvil. Landing futura: dominio ~$12/año + estático S3/CloudFront ~$0.

## Palancas de optimización

- **EventBridge**: publicar solo transiciones (geocerca, batería) en vez de cada posición → de $86 a ~$20 en Crecimiento. Decisión en plan 007.
- **Aurora**: scale-to-zero nocturno; Database Savings Plan 1 año recorta hasta 35 % cuando el gasto se estabilice.
- **DynamoDB**: TTL 90 días; histórico antiguo a S3 si se quiere retener.
- **AWS Budgets**: alarma desde plan 002.

## Riesgos

1. Alcance del partnership Wialon — confirmar límites de dispositivos y API por escrito; excedente volvería a ser coste por dispositivo.
2. Google Maps móvil — modelo cambió en 2025 (free caps por SKU); confirmar map loads nativos sin coste.
3. Intervalo 30 s constante es peor caso — reporte adaptativo bajaría DynamoDB/SQS/EventBridge en proporción.
4. Rangos, no techo — Budgets como red de seguridad.

## Fuentes (verificadas jul 2026)

- Aurora Sv2 ACU y scale-to-zero: https://www.usage.ai/blogs/aws/rds/aurora-serverless-v2/ · https://www.bytebase.com/blog/understanding-aws-aurora-pricing/
- Expo EAS planes: https://checkthat.ai/brands/expo/pricing · https://rnpush.com/blog/expo-eas-pricing-explained
- OpenAI GPT-5 mini: https://pricepertoken.com/pricing-page/model/openai-gpt-5-mini
- Google Maps facturación: https://developers.google.com/maps/billing-and-pricing/faq · https://www.mapsi.dev/google-maps-api-pricing
- Claude Max ($100 5x / $200 20x): https://intuitionlabs.ai/articles/claude-max-plan-pricing-usage-limits
- Codex / ChatGPT Pro ($100 5x / $200 20x, jul 2026): https://www.morphllm.com/codex-pricing
- AWS Lambda/DynamoDB/SQS/API GW/EventBridge/S3/Cognito/CloudWatch: tarifas públicas us-east-1 vigentes.
