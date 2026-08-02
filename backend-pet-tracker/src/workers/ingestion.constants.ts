// Token del DynamoDBDocumentClient del pipeline (R13, D13): se construye en
// IngestionModule envolviendo el DYNAMODB_CLIENT global de #2 — definido una
// vez aqui, importado por provider y @Inject (docs/conventions.md §Tokens).
export const POSITIONS_DOC_CLIENT = Symbol('PositionsDocumentClient');
