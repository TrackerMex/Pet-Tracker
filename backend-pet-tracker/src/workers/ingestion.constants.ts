// Token del DynamoDBDocumentClient del pipeline (R13, D13): se construye en
// IngestionModule envolviendo el DYNAMODB_CLIENT global de #2 — definido una
// vez aqui, importado por provider y @Inject (docs/conventions.md §Tokens).
export const POSITIONS_DOC_CLIENT = Symbol('PositionsDocumentClient');

// EVENT_SOURCE/DETAIL_TYPE_POSITION_UPDATED/DETAIL_TYPE_BATTERY_LOW se
// reubicaron a @/aws/constants (alerts-engine #12 D2): aws/provisioning.ts
// los necesita para el EventPattern de su regla EventBridge sin que la capa
// compartida dependa de esta carpeta de feature. Mismo valor, mismo
// contrato (R16/R17) — importarlos desde @/aws/constants.
