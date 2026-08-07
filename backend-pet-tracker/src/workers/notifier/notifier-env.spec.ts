import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO_ROOT = join(__dirname, '..', '..', '..', '..');
const SRC_ROOT = join(__dirname, '..', '..');

const NEW_VARIABLES = ['PUSH_ENABLED', 'NOTIFIER_ENABLED'];

/** Fuentes que estrena esta feature (R30) — sin sus specs. */
const NEW_SOURCES = [
  'workers/notifier/console-push-sender.ts',
  'workers/notifier/expo-push-sender.ts',
  'workers/notifier/notification-message.schema.ts',
  'workers/notifier/notifier-consumer.service.ts',
  'workers/notifier/notifier-scheduler.service.ts',
  'workers/notifier/notifier.constants.ts',
  'workers/notifier/notifier.module.ts',
  'workers/notifier/push-sender.ts',
  'modules/alerts/alerts.constants.ts',
  'modules/alerts/alerts.module.ts',
  'modules/alerts/application/dto/list-alerts.dto.ts',
  'modules/alerts/application/use-cases/ack-alert.use-case.ts',
  'modules/alerts/application/use-cases/list-alerts.use-case.ts',
  'modules/alerts/domain/cursor.ts',
  'modules/alerts/domain/entities/alert-event.entity.ts',
  'modules/alerts/domain/errors/alert.errors.ts',
  'modules/alerts/domain/repositories/alert.repository.ts',
  'modules/alerts/infrastructure/alerts.controller.ts',
  'modules/alerts/infrastructure/mappers/alert-error.mapper.ts',
  'modules/alerts/infrastructure/mappers/alert-response.mapper.ts',
  'modules/alerts/infrastructure/repositories/alert.drizzle.repository.ts',
  'modules/users/application/dto/register-push-token.dto.ts',
  'modules/users/application/use-cases/delete-push-token.use-case.ts',
  'modules/users/application/use-cases/register-push-token.use-case.ts',
  'modules/users/domain/repositories/push-token.repository.ts',
  'modules/users/infrastructure/mappers/push-token-response.mapper.ts',
  'modules/users/infrastructure/repositories/push-token.drizzle.repository.ts',
  'pipeline/time-away.ts',
  'db/schema/push-tokens.schema.ts',
];

function readRepoFile(relative: string): string {
  return readFileSync(join(REPO_ROOT, relative), 'utf8');
}

describe('R29: PUSH_ENABLED y NOTIFIER_ENABLED documentadas en el mismo cierre', () => {
  it('estan en la tabla "Variables de entorno" de docs/conventions.md', () => {
    const conventions = readRepoFile(join('docs', 'conventions.md'));

    for (const variable of NEW_VARIABLES) {
      expect(conventions).toContain(`\`${variable}\``);
    }
  });

  it('estan en .env.example, con NOTIFIER_ENABLED=true para que la cadena local funcione', () => {
    const envExample = readRepoFile('.env.example');

    for (const variable of NEW_VARIABLES) {
      expect(envExample).toMatch(new RegExp(`^${variable}=`, 'm'));
    }
    expect(envExample).toMatch(/^NOTIFIER_ENABLED=true$/m);
    // PUSH_ENABLED=false es el default local: sin build EAS no hay envio real.
    expect(envExample).toMatch(/^PUSH_ENABLED=false$/m);
  });
});

describe('R29: ninguna fuente nueva lee process.env — todo via ConfigService', () => {
  it.each(NEW_SOURCES)('%s no menciona process.env', (relative) => {
    const source = readFileSync(join(SRC_ROOT, relative), 'utf8');

    expect(source).not.toContain('process.env');
  });

  it('solo el scheduler y el modulo del notifier leen las variables, via ConfigService', () => {
    const scheduler = readFileSync(
      join(SRC_ROOT, 'workers/notifier/notifier-scheduler.service.ts'),
      'utf8',
    );
    const module = readFileSync(
      join(SRC_ROOT, 'workers/notifier/notifier.module.ts'),
      'utf8',
    );

    expect(scheduler).toContain("this.config.get<string>('NOTIFIER_ENABLED')");
    expect(module).toContain("config.get<string>('PUSH_ENABLED')");
    // El consumer no LEE PUSH_ENABLED (solo lo nombra en su JSDoc): no
    // inyecta ConfigService, asi que no puede tener un `if (pushEnabled)` —
    // la rama vive entera en el useFactory del modulo.
    const consumer = readFileSync(
      join(SRC_ROOT, 'workers/notifier/notifier-consumer.service.ts'),
      'utf8',
    );
    expect(consumer).not.toContain('ConfigService');
    expect(consumer).not.toContain('.get<string>(');
  });
});
