import { addCalendarMonthsIso, splitVaccines } from '../vaccine-dates';
import type { Vaccine } from '../../api/types';

const rows: [number, string, string][] = [
  [12, '2026-10-06', '2027-10-06'],
  [1, '2026-12-15', '2027-01-15'],
  [1, '2026-01-31', '2026-02-28'],
  [1, '2024-01-31', '2024-02-29'],
  [1, '2026-03-31', '2026-04-30'],
  [3, '2026-11-30', '2027-02-28'],
  [2, '2026-12-31', '2027-02-28'],
  [12, '2024-02-29', '2025-02-28'],
  [1, '2026-11-30', '2026-12-30'],
];
const nativeProcess = process.getBuiltinModule('process');
const previousZone = nativeProcess.env.TZ;

afterEach(() => {
  if (previousZone === undefined) delete nativeProcess.env.TZ;
  else nativeProcess.env.TZ = previousZone;
});

it.each(rows)('#208 R2: suma %i meses a %s y da %s', (months, iso, expected) => {
  expect(addCalendarMonthsIso(iso, months)).toBe(expected);
});

it.each(rows)('#208 R2: en America/Mexico_City suma %i meses a %s y da %s', (months, iso, expected) => {
  nativeProcess.env.TZ = 'America/Mexico_City';
  expect(addCalendarMonthsIso(iso, months)).toBe(expected);
});

function vaccine(id: string, nextDoseAt: string | null, appliedAt = '2026-01-01'): Vaccine {
  return { id, petId: 'pet-1', catalogId: null, name: id, appliedAt, nextDoseAt, vetName: null, clinic: null, notes: null, documentKey: null };
}

it.each([
  ['2026-12-31', '2027-01-01', 'upcoming'],
  ['2026-12-31', '2026-12-31', 'past'],
  ['2027-01-01', '2026-12-31', 'past'],
  ['2026-12-31', null, 'past'],
  ['2026-09-30', '2026-10-01', 'upcoming'],
  ['2026-10-01', '2026-09-30', 'past'],
  ['2026-12-31', '2027-12-31', 'upcoming'],
  ['2027-02-01', '2026-12-15', 'past'],
  ['2026-12-15', '2027-02-01', 'upcoming'],
] as const)('#241 R2: hoy %s, próxima dosis %s, va a %s', (today, nextDoseAt, section) => {
  const result = splitVaccines([vaccine('v', nextDoseAt)], today);
  expect(result[section].map(item => item.id)).toEqual(['v']);
  expect(result[section === 'past' ? 'upcoming' : 'past'].map(item => item.id)).toEqual([]);
});
