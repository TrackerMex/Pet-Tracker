import { readFileSync } from 'fs';
import { join } from 'path';

import { formatInviteCode, inviteDateParts, memberInitials } from '../pet-members';

it('R23: expo-clipboard es dependencia declarada', () => {
  const manifest = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
  };

  expect(typeof manifest.dependencies['expo-clipboard']).toBe('string');
  expect(manifest.dependencies['expo-clipboard']).toMatch(/^~/);
});

it('R9: memberInitials toma nombre y apellido en mayúsculas', () => {
  expect(memberInitials(' Ana ', ' García ')).toBe('AG');
});

it('R9: memberInitials con apellido vacío deja una sola inicial', () => {
  expect(memberInitials('Ana', ' ')).toBe('A');
});

it('R12: inviteDateParts cruza mes y año', () => {
  const cases: [Date, string, string][] = [
    [new Date(2026, 9, 6, 9, 5), '6 oct', '09:05'],
    [new Date(2026, 11, 30, 23, 59), '30 dic', '23:59'],
    [new Date(2027, 0, 2, 0, 5), '2 ene', '00:05'],
  ];
  for (const [instant, date, time] of cases) {
    expect(inviteDateParts(instant.toISOString(), 'es-MX')).toEqual({ date, time });
  }
});

it('R12: inviteDateParts en en-US da Oct 9 y 14:00', () => {
  expect(inviteDateParts(new Date(2026, 9, 9, 14, 0).toISOString(), 'en-US')).toEqual({ date: 'Oct 9', time: '14:00' });
});

it('R14: formatInviteCode parte diez caracteres en 5 y 5', () => {
  expect(formatInviteCode('K7P4Q2M9XA')).toBe('K7P4Q-2M9XA');
});

it('R14: formatInviteCode deja igual cualquier otra longitud', () => {
  for (const code of ['ABC', 'K7P4Q-2M9XA', '', '123456789']) {
    expect(formatInviteCode(code)).toBe(code);
  }
});
