import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from '@/db/schema/users.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { auditLog } from '@/db/schema/audit-log.schema';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import { AccountDeletionDrizzleRepository } from './account-deletion.drizzle.repository';

const USER_ID = 'user-1',
  P1 = 'p1',
  P2 = 'p2',
  A1 = 'a1',
  D1 = 'd1';
function buildDb(options: { missingUser?: boolean; noPets?: boolean } = {}) {
  const ops: string[] = [],
    inside: boolean[] = [],
    audits: Record<string, unknown>[] = [];
  let inTransaction = false;
  function nameOf(table: unknown) {
    if (table === users) return 'users';
    if (table === petUsers) return 'pet_users';
    if (table === petDevices) return 'pet_devices';
    if (table === devices) return 'devices';
    if (table === pets) return 'pets';
    if (table === auditLog) return 'audit_log';
    throw new Error('Unexpected table');
  }
  function record(op: string) {
    ops.push(op);
    inside.push(inTransaction);
  }
  const tx = {
    select: () => ({
      from: (table: unknown) => ({
        where: () => {
          const rows =
            table === users
              ? options.missingUser
                ? []
                : [{ id: USER_ID }]
              : table === petUsers
                ? options.noPets
                  ? []
                  : [{ petId: P1 }, { petId: P2 }]
                : [{ id: A1, deviceId: D1 }];
          return {
            then: (resolve: (rows: Record<string, unknown>[]) => unknown) => {
              record(`select:${nameOf(table)}`);
              return Promise.resolve(rows).then(resolve);
            },
            for: (mode: string) => {
              record(`select:${nameOf(table)}:for ${mode}`);
              return Promise.resolve(rows);
            },
          };
        },
      }),
    }),
    insert: (table: unknown) => ({
      values: (values: Record<string, unknown>) => {
        record(`insert:${nameOf(table)}`);
        audits.push(values);
        return Promise.resolve();
      },
    }),
    update: (table: unknown) => ({
      set: () => ({
        where: () => {
          record(`update:${nameOf(table)}`);
          return Promise.resolve();
        },
      }),
    }),
    delete: (table: unknown) => ({
      where: () => {
        record(`delete:${nameOf(table)}`);
        return Promise.resolve();
      },
    }),
  };
  const transaction = jest.fn(
    async <T>(fn: (tx: unknown) => Promise<T>): Promise<T> => {
      inTransaction = true;
      try {
        return await fn(tx);
      } finally {
        inTransaction = false;
      }
    },
  );
  const repository = new AccountDeletionDrizzleRepository({
    transaction,
  } as unknown as NodePgDatabase);
  return { repository, transaction, ops, inside, audits };
}
describe('#247 R11: el borrado de cuenta es una sola transacción ordenada', () => {
  it('#247 R11: bloquea, audita, libera, borra mascotas y borra el usuario en una transacción', async () => {
    const { repository, transaction, ops, inside, audits } = buildDb();
    await expect(repository.deleteAccount(USER_ID)).resolves.toEqual([P1, P2]);
    expect(ops).toEqual([
      'select:users:for update',
      'select:pet_users',
      'insert:audit_log',
      'select:pet_devices',
      'update:pet_devices',
      'update:devices',
      'delete:pets',
      'delete:users',
    ]);
    expect(inside).toEqual(Array(8).fill(true));
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(audits).toEqual([
      {
        userId: USER_ID,
        action: 'user.delete',
        entity: 'user',
        entityId: USER_ID,
        meta: { petIds: [P1, P2] },
      },
    ]);
  });
  it('#247 R11: sin mascotas no toca pet_devices ni pets', async () => {
    const { repository, ops, audits, inside, transaction } = buildDb({
      noPets: true,
    });
    await expect(repository.deleteAccount(USER_ID)).resolves.toEqual([]);
    expect(ops).toEqual([
      'select:users:for update',
      'select:pet_users',
      'insert:audit_log',
      'delete:users',
    ]);
    expect(audits[0].meta).toEqual({ petIds: [] });
    expect(inside).toEqual([true, true, true, true]);
    expect(transaction).toHaveBeenCalledTimes(1);
  });
  it('#247 R11: si el usuario no existe rechaza con UserNotFoundError sin escribir', async () => {
    const { repository, ops } = buildDb({ missingUser: true });
    await expect(repository.deleteAccount(USER_ID)).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
    expect(ops).toEqual(['select:users:for update']);
  });
});
