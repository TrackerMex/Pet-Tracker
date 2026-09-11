import { Logger } from '@nestjs/common';
import { User } from '@/modules/auth/domain/entities/user.entity';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { requesterLocalDay } from './requester-local-day';

const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const NOW = new Date('2026-08-11T02:00:00.000Z');

function userWithTimezone(timezone: string): User {
  return { timezone } as User;
}

describe('R3 (dto-dates-owner-timezone #89): requesterLocalDay resuelve el dia civil del requester y degrada a UTC con un warn', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  function dependencies(user: User | null) {
    const findById = jest.fn().mockResolvedValue(user);
    const users = { findById } as unknown as UserRepository;
    return { users, findById };
  }

  it('con zona IANA valida devuelve el dia local de now sin avisar', async () => {
    const { users, findById } = dependencies(
      userWithTimezone('America/Mexico_City'),
    );

    await expect(requesterLocalDay(users, USER_ID, NOW)).resolves.toBe(
      '2026-08-10',
    );
    expect(findById).toHaveBeenCalledWith(USER_ID);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('sin usuario (null) devuelve el dia UTC de now y avisa una vez', async () => {
    const { users } = dependencies(null);

    await expect(requesterLocalDay(users, USER_ID, NOW)).resolves.toBe(
      '2026-08-11',
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.objectContaining({ userId: USER_ID, timezone: null }),
    );
  });

  it("con 'Not/A/Zone' devuelve el dia UTC de now y avisa una vez", async () => {
    const { users } = dependencies(userWithTimezone('Not/A/Zone'));

    await expect(requesterLocalDay(users, USER_ID, NOW)).resolves.toBe(
      '2026-08-11',
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.objectContaining({ userId: USER_ID, timezone: 'Not/A/Zone' }),
    );
  });
});
