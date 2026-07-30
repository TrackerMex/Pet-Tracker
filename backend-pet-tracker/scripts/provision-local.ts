import { config as loadDotenv } from 'dotenv';
import { runProvisioning } from '@/aws/run-provisioning';

// Excepción documentada (R1, ver specs/localstack-provisioning/design.md,
// mismo patrón que drizzle.config.ts): este script corre fuera del
// bootstrap de Nest, así que no hay ConfigService disponible — carga el
// .env raíz explícitamente con dotenv y lee AWS_* de process.env
// (resolveAwsConfigFromEnv, dentro de runProvisioning) en vez de
// ConfigService.get(...).
loadDotenv({ path: '../.env' });

runProvisioning(process.env)
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error: unknown) => {
    // Red de seguridad: runProvisioning ya captura y traduce cualquier
    // error del provisioning (R16); esto solo cubre un fallo realmente
    // inesperado (bug en runProvisioning mismo).
    // eslint-disable-next-line no-console
    console.error('Fallo inesperado en provision-local.ts:', error);
    process.exitCode = 1;
  });
