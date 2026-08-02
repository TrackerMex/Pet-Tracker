// Token del DynamoDBDocumentClient del pipeline (R13, D13): se construye en
// IngestionModule envolviendo el DYNAMODB_CLIENT global de #2 — definido una
// vez aqui, importado por provider y @Inject (docs/conventions.md §Tokens).
export const POSITIONS_DOC_CLIENT = Symbol('PositionsDocumentClient');

// Contrato de eventos congelado (R16/R17, D9) — API publica inter-features:
// lo consumen los planes 006/007/010 y #12. Cambios de shape incrementan
// detail.version, nunca mutacion silenciosa (docs/wialon-module.md).
export const EVENT_SOURCE = 'pet-tracker';
export const DETAIL_TYPE_POSITION_UPDATED = 'position.updated';
export const DETAIL_TYPE_BATTERY_LOW = 'battery.low';
