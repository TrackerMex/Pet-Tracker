import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { NewPet } from '@/modules/pets/domain/repositories/pet.repository';
import { PetDrizzleRepository } from './pet.drizzle.repository';

const UUID_V7_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const OWNER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

function buildNewPet(): NewPet {
  return {
    name: 'Firulais',
    species: 'dog',
    birthDate: '2024-01-15',
    currentWeightKg: 25.5,
  };
}

/**
 * Doble del cliente Drizzle: captura ambos inserts y verifica que corren
 * dentro del callback de db.transaction (la atomicidad real contra
 * Postgres se cubre en test/pets.e2e-spec.ts, docs/conventions.md §Tests).
 */
function buildTransactionDbDouble() {
  const captured: {
    petInsert?: Record<string, unknown>;
    membershipInsert?: Record<string, unknown>;
    insertsInsideTransaction: boolean[];
  } = { insertsInsideTransaction: [] };

  let insideTransaction = false;

  const tx = {
    insert: (table: unknown) => ({
      values: (values: Record<string, unknown>) => {
        captured.insertsInsideTransaction.push(insideTransaction);
        if (table === pets) {
          captured.petInsert = values;
          return {
            returning: () =>
              Promise.resolve([
                {
                  breed: null,
                  approxAgeMonths: null,
                  sex: null,
                  size: null,
                  color: null,
                  sterilized: null,
                  microchip: null,
                  photoKey: null,
                  lostMode: false,
                  lastPosition: null,
                  lastCommunicationAt: null,
                  createdAt: new Date('2026-08-01T10:00:00.000Z'),
                  updatedAt: new Date('2026-08-01T10:00:00.000Z'),
                  ...values,
                },
              ]),
          };
        }
        if (table === petUsers) {
          captured.membershipInsert = values;
        }
        return Promise.resolve();
      },
    }),
  };

  const db = {
    transaction: async <T>(fn: (tx: unknown) => Promise<T>): Promise<T> => {
      insideTransaction = true;
      try {
        return await fn(tx);
      } finally {
        insideTransaction = false;
      }
    },
  };

  return { db: db as unknown as NodePgDatabase, captured };
}

describe('R2: createWithOwner inserta pets y pet_users(owner) en una transaccion', () => {
  it('corre ambos inserts dentro de db.transaction', async () => {
    const { db, captured } = buildTransactionDbDouble();
    const repository = new PetDrizzleRepository(db);

    await repository.createWithOwner(buildNewPet(), OWNER_ID);

    expect(captured.insertsInsideTransaction).toEqual([true, true]);
  });

  it('genera el id UUIDv7 en app y lo reusa como pet_id de la membresia', async () => {
    const { db, captured } = buildTransactionDbDouble();
    const repository = new PetDrizzleRepository(db);

    const pet = await repository.createWithOwner(buildNewPet(), OWNER_ID);

    expect(pet.id).toMatch(UUID_V7_PATTERN);
    expect(captured.petInsert?.id).toBe(pet.id);
    expect(captured.membershipInsert?.petId).toBe(pet.id);
  });

  it('crea la membresia con role owner y status active para el creador', async () => {
    const { db, captured } = buildTransactionDbDouble();
    const repository = new PetDrizzleRepository(db);

    await repository.createWithOwner(buildNewPet(), OWNER_ID);

    expect(captured.membershipInsert).toEqual(
      expect.objectContaining({
        userId: OWNER_ID,
        role: 'owner',
        status: 'active',
      }),
    );
  });

  it('convierte weightKg a string para numeric(5,2) y de vuelta a number en la entidad', async () => {
    const { db, captured } = buildTransactionDbDouble();
    const repository = new PetDrizzleRepository(db);

    const pet = await repository.createWithOwner(buildNewPet(), OWNER_ID);

    expect(captured.petInsert?.currentWeightKg).toBe('25.5');
    expect(pet.currentWeightKg).toBe(25.5);
  });
});
