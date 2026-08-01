import { getTableColumns } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from '@/db/schema/users.schema';
import { NewUser } from '@/modules/auth/domain/repositories/user.repository';
import { UserDrizzleRepository } from './user.drizzle.repository';

const UUID_V7_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function buildNewUser(): NewUser {
  return {
    email: 'ada@example.com',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$salt$digest',
    firstName: 'Ada',
    lastName: 'Lovelace',
    phone: '+525512345678',
    country: 'MX',
    timezone: 'UTC',
    termsAcceptedAt: new Date('2026-07-30T10:00:00.000Z'),
  };
}

/**
 * Doble del cliente Drizzle: captura el payload del insert sin necesitar
 * Postgres (los repositorios reales se cubren end-to-end, ver
 * docs/conventions.md §Tests).
 */
function buildDbDouble() {
  const captured: { insertValues?: Record<string, unknown> } = {};
  const db = {
    insert: () => ({
      values: (insertValues: Record<string, unknown>) => {
        captured.insertValues = insertValues;
        return {
          returning: () =>
            Promise.resolve([
              {
                emailVerifiedAt: null,
                createdAt: new Date('2026-07-30T10:00:00.000Z'),
                updatedAt: new Date('2026-07-30T10:00:00.000Z'),
                ...insertValues,
              },
            ]),
        };
      },
    }),
  };

  return { db: db as unknown as NodePgDatabase, captured };
}

describe('R1: el repositorio genera el id del usuario como UUIDv7 en la app', () => {
  it('inserta con un id UUIDv7 y devuelve la entidad de dominio', async () => {
    const { db, captured } = buildDbDouble();
    const repository = new UserDrizzleRepository(db);

    const user = await repository.create(buildNewUser());

    expect(captured.insertValues?.id).toMatch(UUID_V7_PATTERN);
    expect(user.id).toMatch(UUID_V7_PATTERN);
    expect(user.email).toBe('ada@example.com');
    expect(user.emailVerifiedAt).toBeNull();
  });
});

describe('R15: passwordConfirmation nunca se persiste', () => {
  it('solo envia columnas existentes de la tabla users, sin passwordConfirmation', async () => {
    const { db, captured } = buildDbDouble();
    const repository = new UserDrizzleRepository(db);

    await repository.create(buildNewUser());

    const columns = Object.keys(getTableColumns(users));
    expect(columns).not.toContain('passwordConfirmation');
    expect(Object.keys(captured.insertValues ?? {})).toEqual(
      expect.arrayContaining(['id', 'email', 'passwordHash']),
    );
    for (const key of Object.keys(captured.insertValues ?? {})) {
      expect(columns).toContain(key);
    }
  });
});
