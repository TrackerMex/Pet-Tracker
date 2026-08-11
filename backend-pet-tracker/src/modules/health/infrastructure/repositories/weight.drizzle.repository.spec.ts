import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NewPetWeight } from '@/modules/health/domain/repositories/weight.repository';
import { WeightDrizzleRepository } from './weight.drizzle.repository';

const NEW_WEIGHT: NewPetWeight = {
  petId: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
  weightKg: 21.35,
  measuredAt: '2026-08-11',
  bodyCondition: 5,
  createdBy: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b78',
};

function buildDbDouble(options: { updateFails?: boolean } = {}) {
  const captured = {
    operationsInsideTransaction: [] as boolean[],
    transactionCalls: 0,
    committedInserts: [] as Record<string, unknown>[],
  };
  let insideTransaction = false;
  let stagedInserts: Record<string, unknown>[] = [];

  const client = {
    insert: () => ({
      values: (values: Record<string, unknown>) => ({
        returning: () => {
          captured.operationsInsideTransaction.push(insideTransaction);
          if (insideTransaction) stagedInserts.push(values);
          else captured.committedInserts.push(values);
          return Promise.resolve([values]);
        },
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => {
          captured.operationsInsideTransaction.push(insideTransaction);
          if (options.updateFails) {
            return Promise.reject(new Error('pets update failed'));
          }
          return Promise.resolve();
        },
      }),
    }),
    select: () => ({
      from: () => ({
        where: () => ({}),
      }),
    }),
  };

  const db = {
    ...client,
    transaction: async <T>(fn: (tx: typeof client) => Promise<T>) => {
      captured.transactionCalls += 1;
      insideTransaction = true;
      stagedInserts = [];
      try {
        const result = await fn(client);
        captured.committedInserts.push(...stagedInserts);
        return result;
      } finally {
        stagedInserts = [];
        insideTransaction = false;
      }
    },
  };

  return { db: db as unknown as NodePgDatabase, captured };
}

describe('R4 (health-weights #15): insert y update comparten una transaccion', () => {
  it('ejecuta ambas escrituras dentro del callback de db.transaction', async () => {
    const { db, captured } = buildDbDouble();

    await new WeightDrizzleRepository(db).create(NEW_WEIGHT);

    expect(captured.transactionCalls).toBe(1);
    expect(captured.operationsInsideTransaction).toEqual([true, true]);
  });

  it('si falla el update no confirma el insert', async () => {
    const { db, captured } = buildDbDouble({ updateFails: true });

    await expect(
      new WeightDrizzleRepository(db).create(NEW_WEIGHT),
    ).rejects.toThrow('pets update failed');

    expect(captured.committedInserts).toEqual([]);
  });
});
