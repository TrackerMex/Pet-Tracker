// Tokens de inyección para los 4 clientes AWS SDK v3 (docs/conventions.md
// §Tokens de inyección) — módulos futuros (media, positions, workers,
// reminders) los inyectan con @Inject(SQS_CLIENT) etc.
export const SQS_CLIENT = Symbol('SQS_CLIENT');
export const DYNAMODB_CLIENT = Symbol('DYNAMODB_CLIENT');
export const S3_CLIENT = Symbol('S3_CLIENT');
export const EVENTBRIDGE_CLIENT = Symbol('EVENTBRIDGE_CLIENT');
