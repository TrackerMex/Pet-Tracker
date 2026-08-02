import { FLAG_LOW_ACCURACY, FLAG_SUSPECT_JUMP } from '@/pipeline/constants';
import {
  encodeCursor,
  queryFingerprint,
} from '@/modules/positions/domain/cursor';
import type { StoredPosition } from '@/modules/positions/domain/entities/position.entity';
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

/** Tres puntos sembrados: limpio, low_accuracy y suspect_jump (D1). */
function threeFlaggedItems(): StoredPosition[] {
  const base = {
    lat: 19.4,
    lng: -99.1,
    speedKmh: 4,
    course: 90,
    altitude: 2240,
    sats: 9,
    accuracyM: 8,
    batteryPct: 77,
  };

  return [
    { ...base, ts: 1_000, flags: [] },
    { ...base, ts: 2_000, flags: [FLAG_LOW_ACCURACY] },
    { ...base, ts: 3_000, flags: [FLAG_SUSPECT_JUMP] },
  ];
}

describe('R12: por defecto se ocultan solo los low_accuracy; includeSuspect=true no filtra nada', () => {
  it('sin includeSuspect devuelve 2 de 3: cae el low_accuracy, se queda el suspect_jump', async () => {
    const { reader } = fakeReader({
      items: threeFlaggedItems(),
      lastKey: null,
    });
    const useCase = new ListPositionsUseCase(reader);

    const result = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO },
      NOW,
    );

    expect(result.items.map((item) => item.ts)).toEqual([1_000, 3_000]);
  });

  it('includeSuspect=false se comporta igual que la ausencia del parametro', async () => {
    const { reader } = fakeReader({
      items: threeFlaggedItems(),
      lastKey: null,
    });
    const useCase = new ListPositionsUseCase(reader);

    const result = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO, includeSuspect: 'false' },
      NOW,
    );

    expect(result.items.map((item) => item.ts)).toEqual([1_000, 3_000]);
  });

  it('includeSuspect=true devuelve los 3 sin filtrar por flags', async () => {
    const { reader } = fakeReader({
      items: threeFlaggedItems(),
      lastKey: null,
    });
    const useCase = new ListPositionsUseCase(reader);

    const result = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO, includeSuspect: 'true' },
      NOW,
    );

    expect(result.items.map((item) => item.ts)).toEqual([1_000, 2_000, 3_000]);
  });

  it('un punto con ambos flags cae por defecto y vuelve con includeSuspect=true', async () => {
    const both: StoredPosition[] = [
      {
        ts: 5_000,
        lat: 19.4,
        lng: -99.1,
        speedKmh: null,
        course: null,
        altitude: null,
        sats: null,
        accuracyM: null,
        batteryPct: null,
        flags: [FLAG_LOW_ACCURACY, FLAG_SUSPECT_JUMP],
      },
    ];
    const useCase = new ListPositionsUseCase(
      fakeReader({ items: both, lastKey: null }).reader,
    );
    const withFlag = new ListPositionsUseCase(
      fakeReader({ items: both, lastKey: null }).reader,
    );

    await expect(
      useCase.execute({ petId: PET_A, from: FROM, to: TO }, NOW),
    ).resolves.toEqual({ items: [], nextCursor: null });
    await expect(
      withFlag.execute(
        { petId: PET_A, from: FROM, to: TO, includeSuspect: 'true' },
        NOW,
      ),
    ).resolves.toEqual({ items: both, nextCursor: null });
  });
});

describe('R15: la paginacion es de la Query, no del resultado filtrado', () => {
  it('una pagina que el filtro deja vacia conserva su nextCursor no nulo', async () => {
    const onlyLowAccuracy = threeFlaggedItems().filter((item) =>
      item.flags.includes(FLAG_LOW_ACCURACY),
    );
    const { reader } = fakeReader({ items: onlyLowAccuracy, lastKey: 9_999 });
    const useCase = new ListPositionsUseCase(reader);

    const result = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO },
      NOW,
    );

    expect(result.items).toEqual([]);
    expect(result.nextCursor).not.toBeNull();
  });

  it('un rango sin ninguna posicion devuelve items vacios y nextCursor null', async () => {
    const { reader } = fakeReader({ items: [], lastKey: null });
    const useCase = new ListPositionsUseCase(reader);

    await expect(
      useCase.execute({ petId: PET_A, from: FROM, to: TO }, NOW),
    ).resolves.toEqual({ items: [], nextCursor: null });
  });
});

describe('R11: el envelope tiene exactamente items y nextCursor', () => {
  it('la respuesta no lleva ninguna clave extra', async () => {
    const { reader } = fakeReader({
      items: threeFlaggedItems(),
      lastKey: null,
    });
    const useCase = new ListPositionsUseCase(reader);

    const result = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO },
      NOW,
    );

    expect(Object.keys(result).sort()).toEqual(['items', 'nextCursor']);
  });

  it('los items salen ordenados por ts estrictamente ascendente', async () => {
    const { reader } = fakeReader({
      items: threeFlaggedItems(),
      lastKey: null,
    });
    const useCase = new ListPositionsUseCase(reader);

    const result = await useCase.execute(
      { petId: PET_A, from: FROM, to: TO, includeSuspect: 'true' },
      NOW,
    );

    const timestamps = result.items.map((item) => item.ts);
    expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b));
    expect(new Set(timestamps).size).toBe(timestamps.length);
  });
});
