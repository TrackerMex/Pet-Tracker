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

// maxReceiveCount para ambas RedrivePolicy — valor conservador fijado en
// design.md, ajustable sin migración (LocalStack se reprovisiona en cada
// `docker compose down -v`).
export const SQS_MAX_RECEIVE_COUNT = 3;

// DynamoDB
export const TABLE_POSITIONS = 'positions';
export const TABLE_POSITIONS_PARTITION_KEY = 'pk';
export const TABLE_POSITIONS_SORT_KEY = 'sk';
export const TABLE_POSITIONS_TTL_ATTRIBUTE = 'expires_at';

// S3 — sufijo -local explícito: nunca se reutiliza este nombre contra un
// bucket de AWS real (design.md).
export const BUCKET_MEDIA = 'pet-tracker-media-local';

// EventBridge
export const EVENT_BUS_NAME = 'pet-tracker';
