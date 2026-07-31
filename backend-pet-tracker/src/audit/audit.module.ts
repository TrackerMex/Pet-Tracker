import { Global, Module } from '@nestjs/common';
import { AuditLogDrizzleRepository } from './audit-log.drizzle.repository';
import { AUDIT_LOGGER } from './audit-log.repository';

/**
 * Infraestructura compartida (misma forma que src/db/drizzle.module.ts y
 * src/aws/aws.module.ts): expone el puerto de auditoria bajo un unico token
 * para que cualquier modulo escriba en `audit_log` sin re-declarar el
 * provider.
 */
@Global()
@Module({
  providers: [
    {
      provide: AUDIT_LOGGER,
      useClass: AuditLogDrizzleRepository,
    },
  ],
  exports: [AUDIT_LOGGER],
})
export class AuditModule {}
