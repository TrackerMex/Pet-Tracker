// Nombres de recursos AWS provisionados en LocalStack — constantes
// compartidas entre scripts/provision-local.ts (quien los crea) y los
// módulos futuros que los consumirán (quien los usa), para evitar typos
// entre ambos lados (design.md).

// SQS: sin sufijo de entorno — los nombres coinciden con docs/data-model.md
// y con el acceptance_criteria de la feature; otras specs futuras (#8, #9,
// #12, #13, #16) ya asumen estos nombres exactos.
export const QUEUE_POSITIONS_RAW = 'positions-raw';
export const QUEUE_POSITIONS_RAW_DLQ = 'positions-raw-dlq';
export const QUEUE_NOTIFICATIONS = 'notifications';
export const QUEUE_NOTIFICATIONS_DLQ = 'notifications-dlq';

// Cola destino de la regla EventBridge de alerts-engine (#12 R3/R4, D2):
// recibe el sobre completo de position.updated/battery.low.
export const QUEUE_GEOFENCE_EVENTS = 'geofence-events';
export const QUEUE_GEOFENCE_EVENTS_DLQ = 'geofence-events-dlq';

// Nombre de la regla EventBridge de alerts-engine (#12 R4, D2) — mismo
// string que la cola destino, namespaces distintos (SQS vs EventBridge).
export const RULE_GEOFENCE_EVENTS = 'geofence-events';

// maxReceiveCount para ambas RedrivePolicy — valor conservador fijado en
// design.md, ajustable sin migración (LocalStack se reprovisiona en cada
// `docker compose down -v`).
export const SQS_MAX_RECEIVE_COUNT = 3;

// DynamoDB
export const TABLE_POSITIONS = 'positions';
export const TABLE_POSITIONS_PARTITION_KEY = 'pk';
export const TABLE_POSITIONS_SORT_KEY = 'sk';
export const TABLE_POSITIONS_TTL_ATTRIBUTE = 'expires_at';

// S3 — base compartida; el runtime local conserva el sufijo -local y el
// stack CDK de #20 compone dev-<accountId> para el bucket de AWS real.
export const BUCKET_MEDIA_BASE = 'pet-tracker-media';

/** Compone `<base>-<suffix>`; con suffix vacío devuelve `base` sin tocar. */
export const resourceName = (base: string, suffix: string): string =>
  suffix === '' ? base : `${base}-${suffix}`;

export const BUCKET_MEDIA = resourceName(BUCKET_MEDIA_BASE, 'local');

// EventBridge
export const EVENT_BUS_NAME = 'pet-tracker';

// Contrato de eventos congelado (wialon-ingestion-pipeline #8 R16/R17) —
// reubicado desde workers/ingestion.constants.ts (alerts-engine #12 D2):
// aws/provisioning.ts (capa compartida) los necesita para el EventPattern
// de la regla de R4 sin invertir la direccion de dependencia hacia una
// capa de feature. Valor identico, contrato intacto — relocacion mecanica.
export const EVENT_SOURCE = 'pet-tracker';
export const DETAIL_TYPE_POSITION_UPDATED = 'position.updated';
export const DETAIL_TYPE_BATTERY_LOW = 'battery.low';
