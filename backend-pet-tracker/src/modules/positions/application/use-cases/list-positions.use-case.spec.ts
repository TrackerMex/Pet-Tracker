import {
  encodeCursor,
  queryFingerprint,
} from '@/modules/positions/domain/cursor';
import {
  InvalidCursorError,
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
const PET_B = '018f5a3e-0000-7000-8000-000000000002';

const NOW = new Date('2026-08-02T12:00:00.000Z');

const FROM = '2026-08-02T08:00:00.000Z';
const TO = '2026-08-02T09:00:00.000Z';

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

describe('R13: nextCursor sale del LastEvaluatedKey y reanuda la lectura en el sk codificado', () => {
  it('sin LastEvaluatedKey el nextCursor es null', async () => {
    const { reader } = fakeReader({ items: [], lastKey: null });
    const useCase = new ListPositionsUseCase(reader);

    const result = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO },
      NOW,
    );

    expect(result.nextCursor).toBeNull();
  });

  it('con LastEvaluatedKey emite un cursor que codifica ese sk, la mascota y la huella', async () => {
    const { reader } = fakeReader({ items: [], lastKey: 1_754_123_456_789 });
    const useCase = new ListPositionsUseCase(reader);

    const result = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO },
      NOW,
    );

    expect(result.nextCursor).toBe(
      encodeCursor({
        petId: PET_A,
        fingerprint: queryFingerprint(Date.parse(FROM), Date.parse(TO), false),
        lastSk: 1_754_123_456_789,
      }),
    );
  });

  it('la huella distingue includeSuspect: el cursor emitido con el flag es otro', async () => {
    const { reader } = fakeReader({ items: [], lastKey: 7 });
    const useCase = new ListPositionsUseCase(reader);

    const plain = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO },
      NOW,
    );
    const withFlag = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO, includeSuspect: 'true' },
      NOW,
    );

    expect(plain.nextCursor).not.toBe(withFlag.nextCursor);
  });

  it('reenviar el cursor arranca la Query tras el sk codificado', async () => {
    const { reader, calls } = fakeReader({ items: [], lastKey: null });
    const useCase = new ListPositionsUseCase(reader);
    const cursor = encodeCursor({
      petId: PET_A,
      fingerprint: queryFingerprint(Date.parse(FROM), Date.parse(TO), false),
      lastSk: 1_754_123_456_789,
    });

    await useCase.execute({ petId: PET_A, from: FROM, to: TO, cursor }, NOW);

    expect(calls[0].startAfterSk).toBe(1_754_123_456_789);
    expect(calls[0].fromMs).toBe(Date.parse(FROM));
    expect(calls[0].toMs).toBe(Date.parse(TO));
  });

  it('sin cursor la Query arranca por el principio del rango', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);

    await useCase.execute({ petId: PET_A, from: FROM, to: TO }, NOW);

    expect(calls[0].startAfterSk).toBeNull();
  });
});

describe('R14: cursor corrupto, de otra mascota o de otra consulta => InvalidCursorError sin Query', () => {
  it('un cursor que no decodifica se rechaza sin llamar al reader', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);

    await expect(
      useCase.execute({ petId: PET_A, from: FROM, to: TO, cursor: '???' }, NOW),
    ).rejects.toBeInstanceOf(InvalidCursorError);
    expect(calls).toHaveLength(0);
  });

  it('un cursor legitimo de la mascota A reenviado en la ruta de B se rechaza sin Query', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);
    const cursorOfA = encodeCursor({
      petId: PET_A,
      fingerprint: queryFingerprint(Date.parse(FROM), Date.parse(TO), false),
      lastSk: 42,
    });

    await expect(
      useCase.execute(
        { petId: PET_B, from: FROM, to: TO, cursor: cursorOfA },
        NOW,
      ),
    ).rejects.toBeInstanceOf(InvalidCursorError);
    expect(calls).toHaveLength(0);
  });

  it('un cursor de otro rango se rechaza sin Query', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);
    const cursorOfAnotherRange = encodeCursor({
      petId: PET_A,
      fingerprint: queryFingerprint(0, 1, false),
      lastSk: 42,
    });

    await expect(
      useCase.execute(
        { petId: PET_A, from: FROM, to: TO, cursor: cursorOfAnotherRange },
        NOW,
      ),
    ).rejects.toBeInstanceOf(InvalidCursorError);
    expect(calls).toHaveLength(0);
  });

  it('un cursor emitido sin includeSuspect no vale para la consulta con el flag', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);
    const cursorWithoutFlag = encodeCursor({
      petId: PET_A,
      fingerprint: queryFingerprint(Date.parse(FROM), Date.parse(TO), false),
      lastSk: 42,
    });

    await expect(
      useCase.execute(
        {
          petId: PET_A,
          from: FROM,
          to: TO,
          cursor: cursorWithoutFlag,
          includeSuspect: 'true',
        },
        NOW,
      ),
    ).rejects.toBeInstanceOf(InvalidCursorError);
    expect(calls).toHaveLength(0);
  });

  it('la mascota consultada sale siempre del input autorizado, nunca del cursor', async () => {
    const { reader, calls } = fakeReader();
    const useCase = new ListPositionsUseCase(reader);
    const cursor = encodeCursor({
      petId: PET_A,
      fingerprint: queryFingerprint(Date.parse(FROM), Date.parse(TO), false),
      lastSk: 42,
    });

    await useCase.execute({ petId: PET_A, from: FROM, to: TO, cursor }, NOW);

    expect(calls[0].petId).toBe(PET_A);
  });
});
