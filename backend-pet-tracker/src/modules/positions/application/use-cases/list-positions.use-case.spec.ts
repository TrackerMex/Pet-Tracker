import {
  InvalidRangeError,
  RangeTooLargeError,
} from '@/modules/positions/domain/errors/position.errors';
import type {
  PositionHistoryPage,
  PositionHistoryQuery,
  PositionHistoryReader,
} from '@/modules/positions/domain/repositories/position-history.reader';
import {
  DEFAULT_RANGE_MINUTES,
  MAX_RANGE_HOURS,
} from '@/modules/positions/positions.constants';
import { ListPositionsUseCase } from './list-positions.use-case';

const PET_A = '018f5a3e-0000-7000-8000-000000000001';

const NOW = new Date('2026-08-02T12:00:00.000Z');

/** Reader espia: registra la Query emitida y devuelve la pagina que se le fije. */
function fakeReader(page: PositionHistoryPage = { items: [], lastKey: null }) {
  const calls: PositionHistoryQuery[] = [];
  const reader: PositionHistoryReader = {
    queryPage: jest.fn((query: PositionHistoryQuery) => {
      calls.push(query);
      return Promise.resolve(page);
    }),
  };

  return { reader, calls };
}

describe('R8: defaults to = now y from = to - DEFAULT_RANGE_MINUTES, con reloj inyectado', () => {
  it('sin from ni to consulta la ventana [now - 60 min, now]', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);

    await useCase.execute({ petId: PET_A }, NOW);

    expect(calls).toHaveLength(1);
    expect(calls[0].toMs).toBe(NOW.getTime());
    expect(calls[0].fromMs).toBe(
      NOW.getTime() - DEFAULT_RANGE_MINUTES * 60_000,
    );
  });

  it('con to explicito, from se deriva de ese to y no del reloj', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);
    const to = '2026-08-02T09:00:00.000Z';

    await useCase.execute({ petId: PET_A, to }, NOW);

    expect(calls[0].toMs).toBe(Date.parse(to));
    expect(calls[0].fromMs).toBe(
      Date.parse(to) - DEFAULT_RANGE_MINUTES * 60_000,
    );
  });

  it('con from explicito y sin to, el to es el reloj del servidor', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);
    const from = '2026-08-02T11:00:00.000Z';

    await useCase.execute({ petId: PET_A, from }, NOW);

    expect(calls[0].fromMs).toBe(Date.parse(from));
    expect(calls[0].toMs).toBe(NOW.getTime());
  });

  it('con ambos explicitos usa exactamente esos limites', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);

    await useCase.execute(
      {
        petId: PET_A,
        from: '2026-08-02T08:00:00.000Z',
        to: '2026-08-02T09:30:00.000Z',
      },
      NOW,
    );

    expect(calls[0].fromMs).toBe(Date.parse('2026-08-02T08:00:00.000Z'));
    expect(calls[0].toMs).toBe(Date.parse('2026-08-02T09:30:00.000Z'));
  });
});

describe('R9: from >= to es INVALID_RANGE y > 24 h es RANGE_TOO_LARGE, ambos sin consultar DynamoDB', () => {
  it('from posterior a to lanza InvalidRangeError sin llamar al reader', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);

    await expect(
      useCase.execute(
        {
          petId: PET_A,
          from: '2026-08-02T10:00:00.000Z',
          to: '2026-08-02T09:00:00.000Z',
        },
        NOW,
      ),
    ).rejects.toBeInstanceOf(InvalidRangeError);
    expect(calls).toHaveLength(0);
  });

  it('from igual a to tambien es InvalidRangeError', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);
    const instant = '2026-08-02T09:00:00.000Z';

    await expect(
      useCase.execute({ petId: PET_A, from: instant, to: instant }, NOW),
    ).rejects.toBeInstanceOf(InvalidRangeError);
    expect(calls).toHaveLength(0);
  });

  it('un rango de 25 h lanza RangeTooLargeError sin llamar al reader', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);
    const to = NOW.getTime();
    const from = to - 25 * 3_600_000;

    await expect(
      useCase.execute(
        {
          petId: PET_A,
          from: new Date(from).toISOString(),
          to: new Date(to).toISOString(),
        },
        NOW,
      ),
    ).rejects.toBeInstanceOf(RangeTooLargeError);
    expect(calls).toHaveLength(0);
  });

  it('un rango de exactamente MAX_RANGE_HOURS se acepta', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);
    const to = NOW.getTime();
    const from = to - MAX_RANGE_HOURS * 3_600_000;

    await expect(
      useCase.execute(
        {
          petId: PET_A,
          from: new Date(from).toISOString(),
          to: new Date(to).toISOString(),
        },
        NOW,
      ),
    ).resolves.toEqual({ items: [], nextCursor: null });
    expect(calls).toHaveLength(1);
  });
});
