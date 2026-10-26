import { validateVaccine } from './form-rules';
import type { FieldIssues } from './account-rules';

type PetValues = {
  name: string;
  ageMode: 'birthDate' | 'months';
  birthDate: Date | null;
  approxAgeMonths: string;
};
type Rules = {
  validateAddPetBasics: (values: { name: string }) => FieldIssues<'name'>;
  validateAddPet: (values: PetValues) => FieldIssues<'name' | 'birthDate' | 'approxAgeMonths'>;
  validateReminder: (values: { title: string; dueAt: Date | null; nowMs: number }) => FieldIssues<'title' | 'date'>;
  validateDocument: (values: { type: string; name: string; date: string }) => FieldIssues<'type' | 'name' | 'date'>;
  validateWeight: (values: { weight: string; measuredAt: string; bodyCondition: string }) => FieldIssues<'weight' | 'measuredAt' | 'bodyCondition'>;
  parseDecimal: (text: string) => number;
};

const {
  validateAddPetBasics, validateAddPet, validateReminder, validateDocument, validateWeight, parseDecimal,
} = jest.requireActual<Rules>('./form-rules');
const { readFileSync } = jest.requireActual<{
  readFileSync: (path: string, encoding: 'utf8') => string;
}>('fs');

const validPet: PetValues = {
  name: 'Luna', ageMode: 'birthDate', birthDate: new Date('2024-04-09T00:00:00.000Z'), approxAgeMonths: '12',
};
const validDocument = { type: 'Vaccine', name: 'Rabies', date: '2026-10-09' };
const validWeight = { weight: '72.5', measuredAt: '2026-10-09', bodyCondition: '' };

describe('#186 R2: reglas puras de los cuatro formularios', () => {
  it.each<[string, Partial<PetValues>, FieldIssues<'name' | 'birthDate' | 'approxAgeMonths'>]>([
    ['nombre vacío', { name: '' }, { name: { labelKey: 'addPet.nameIsRequired' } }],
    ['nombre en blanco', { name: '   ' }, { name: { labelKey: 'addPet.nameIsRequired' } }],
    ['nombre válido', { name: 'Luna' }, {}],
    ['fecha ausente', { birthDate: null }, { birthDate: { labelKey: 'addPet.chooseBirthDate' } }],
    ['fecha elegida', {}, {}],
    ['meses vacíos', { ageMode: 'months', approxAgeMonths: '' }, { approxAgeMonths: { labelKey: 'addPet.errorAgeRange' } }],
    ['meses negativos', { ageMode: 'months', approxAgeMonths: '-1' }, { approxAgeMonths: { labelKey: 'addPet.errorAgeRange' } }],
    ['meses decimales', { ageMode: 'months', approxAgeMonths: '1.5' }, { approxAgeMonths: { labelKey: 'addPet.errorAgeRange' } }],
    ['meses texto', { ageMode: 'months', approxAgeMonths: 'abc' }, { approxAgeMonths: { labelKey: 'addPet.errorAgeRange' } }],
    ['meses con espacio', { ageMode: 'months', approxAgeMonths: ' 12' }, { approxAgeMonths: { labelKey: 'addPet.errorAgeRange' } }],
    ['meses sobre el máximo', { ageMode: 'months', approxAgeMonths: '481' }, { approxAgeMonths: { labelKey: 'addPet.errorAgeRange' } }],
    ['meses cero', { ageMode: 'months', approxAgeMonths: '0' }, {}],
    ['meses doce', { ageMode: 'months', approxAgeMonths: '12' }, {}],
    ['meses máximo', { ageMode: 'months', approxAgeMonths: '480' }, {}],
    ['fecha inactiva', { ageMode: 'months', birthDate: null }, {}],
    ['meses inactivos', { approxAgeMonths: 'abc' }, {}],
    ['dos campos inválidos', { name: '', birthDate: null }, {
      name: { labelKey: 'addPet.nameIsRequired' }, birthDate: { labelKey: 'addPet.chooseBirthDate' },
    }],
  ])('#186 R2: mascota %s', (_name, changes, expected) => {
    expect(validateAddPet({ ...validPet, ...changes })).toEqual(expected);
  });

  it.each<[string, string, Date | null, FieldIssues<'title' | 'date'>]>([
    ['título en blanco', '  ', new Date(1_000_001), { title: { labelKey: 'addReminder.titleIsRequired' } }],
    ['sin fecha', 'Vaccine', null, { date: { labelKey: 'addReminder.pickDate' } }],
    ['fecha igual a ahora', 'Vaccine', new Date(1_000_000), { date: { labelKey: 'addReminder.dateMustBeFuture' } }],
    ['fecha anterior', 'Vaccine', new Date(999_999), { date: { labelKey: 'addReminder.dateMustBeFuture' } }],
    ['fecha posterior', 'Vaccine', new Date(1_000_001), {}],
    ['dos campos inválidos', '', null, {
      title: { labelKey: 'addReminder.titleIsRequired' }, date: { labelKey: 'addReminder.pickDate' },
    }],
  ])('#186 R2: recordatorio %s', (_name, title, dueAt, expected) => {
    expect(validateReminder({ title, dueAt, nowMs: 1_000_000 })).toEqual(expected);
  });

  it.each<[string, Partial<typeof validDocument>, FieldIssues<'type' | 'name' | 'date'>]>([
    ['tipo vacío', { type: '' }, { type: { labelKey: 'validation.required' } }],
    ['tipo en blanco', { type: '   ' }, { type: { labelKey: 'validation.required' } }],
    ['nombre vacío', { name: '' }, { name: { labelKey: 'validation.required' } }],
  ])('#186 R2: documento %s', (_name, changes, expected) => {
    expect(validateDocument({ ...validDocument, ...changes })).toEqual(expected);
  });

  it.each<[string, FieldIssues<'type' | 'name' | 'date'>]>([
    ['2026-10-09', {}],
    [' 2026-10-09 ', {}],
    ['2024-02-29', {}],
    ['', { date: { labelKey: 'validation.invalidDate' } }],
    ['09/10/2026', { date: { labelKey: 'validation.invalidDate' } }],
    ['2026-2-3', { date: { labelKey: 'validation.invalidDate' } }],
    ['2026-02-30', { date: { labelKey: 'validation.invalidDate' } }],
    ['2026-02-29', { date: { labelKey: 'validation.invalidDate' } }],
    ['2026-13-01', { date: { labelKey: 'validation.invalidDate' } }],
    ['2026-10-32', { date: { labelKey: 'validation.invalidDate' } }],
  ])('#186 R2: fecha de documento «%s»', (date, expected) => {
    expect(validateDocument({ ...validDocument, date })).toEqual(expected);
  });

  it.each<[string, FieldIssues<'weight' | 'measuredAt' | 'bodyCondition'>]>([
    ['', { weight: { labelKey: 'weightLog.enterValidWeight' } }],
    ['abc', { weight: { labelKey: 'weightLog.enterValidWeight' } }],
    ['12abc', { weight: { labelKey: 'weightLog.enterValidWeight' } }],
    ['1e3', { weight: { labelKey: 'weightLog.enterValidWeight' } }],
    ['--1', { weight: { labelKey: 'weightLog.enterValidWeight' } }],
    ['0', { weight: { labelKey: 'validation.weightRange' } }],
    ['0.0', { weight: { labelKey: 'validation.weightRange' } }],
    ['-1', { weight: { labelKey: 'validation.weightRange' } }],
    ['999.991', { weight: { labelKey: 'validation.weightRange' } }],
    ['1000', { weight: { labelKey: 'validation.weightRange' } }],
    ['72.5', {}],
    ['72,5', {}],
    [' 72.5 ', {}],
    ['.5', {}],
    ['5.', {}],
    ['999.99', {}],
    ['1,000', {}],
  ])('#186 R2: peso «%s»', (weight, expected) => {
    expect(validateWeight({ ...validWeight, weight })).toEqual(expected);
  });

  it.each<[string, FieldIssues<'weight' | 'measuredAt' | 'bodyCondition'>]>([
    ['2026-10-09', {}],
    [' 2026-10-09 ', {}],
    ['2024-02-29', {}],
    ['', { measuredAt: { labelKey: 'validation.invalidDate' } }],
    ['09/10/2026', { measuredAt: { labelKey: 'validation.invalidDate' } }],
    ['2026-2-3', { measuredAt: { labelKey: 'validation.invalidDate' } }],
    ['2026-02-30', { measuredAt: { labelKey: 'validation.invalidDate' } }],
    ['2026-02-29', { measuredAt: { labelKey: 'validation.invalidDate' } }],
    ['2026-13-01', { measuredAt: { labelKey: 'validation.invalidDate' } }],
    ['2026-10-32', { measuredAt: { labelKey: 'validation.invalidDate' } }],
  ])('#186 R2: fecha del peso «%s»', (measuredAt, expected) => {
    expect(validateWeight({ ...validWeight, measuredAt })).toEqual(expected);
  });

  it.each<[string, FieldIssues<'weight' | 'measuredAt' | 'bodyCondition'>]>([
    ['', {}], ['  ', {}], ['1', {}], ['9', {}], [' 5 ', {}],
    ['0', { bodyCondition: { labelKey: 'validation.bodyConditionRange' } }],
    ['10', { bodyCondition: { labelKey: 'validation.bodyConditionRange' } }],
    ['5.5', { bodyCondition: { labelKey: 'validation.bodyConditionRange' } }],
    ['abc', { bodyCondition: { labelKey: 'validation.bodyConditionRange' } }],
    ['-1', { bodyCondition: { labelKey: 'validation.bodyConditionRange' } }],
  ])('#186 R2: condición corporal «%s»', (bodyCondition, expected) => {
    expect(validateWeight({ ...validWeight, bodyCondition })).toEqual(expected);
  });

  it.each([
    ['72,5', 72.5], [' 72.5 ', 72.5], ['5.', 5], ['.5', 0.5],
  ])('#186 R2: parseDecimal «%s» devuelve %s', (text, expected) => {
    expect(parseDecimal(text)).toBe(expected);
  });

  it('#186 R2: el módulo no importa frameworks ni pantallas', () => {
    const source = readFileSync('src/utils/form-rules.ts', 'utf8');
    expect(source).not.toMatch(/(?:from\s*|require\s*\()['"](?:zod|react|heroui|[^'"]*screens\/)/);
  });

  it.each([
    'weightLog.enterValidWeight', 'validation.weightRange', 'validation.bodyConditionRange',
    'validation.invalidDate', 'validation.required', 'addReminder.titleIsRequired',
    'addReminder.pickDate', 'addReminder.dateMustBeFuture', 'addPet.nameIsRequired',
    'addPet.chooseBirthDate', 'addPet.errorAgeRange',
  ])('#186 R2: declara una sola vez labelKey %s', (key) => {
    const source = readFileSync('src/utils/form-rules.ts', 'utf8');
    expect(source.split("labelKey: '" + key + "'").length - 1).toBe(1);
  });
});


describe('#191 R7: validateAddPetBasics', () => {
  it.each(['', '   ', 'a', 'a'.repeat(120)])('valida el nombre %p sin comprobar edad', (name) => {
    const expected = name.trim() ? {} : { name: { labelKey: 'addPet.nameIsRequired' } };
    expect(validateAddPetBasics({ name })).toEqual(expected);
    if (!name.trim()) {
      expect(validateAddPetBasics({ name }).name).toBe(validateAddPet({ ...validPet, name }).name);
    }
  });
});


describe('#208 R3: nombre libre de vacuna', () => {
  it('#208 R3: «Otra vacuna» con nombre en blanco pide el nombre', () => {
    expect(typeof validateVaccine).toBe('function');
    for (const name of ['', '   ']) {
      expect(validateVaccine({ mode: 'other', name })).toEqual({ name: { labelKey: 'vaccineCreate.nameRequired' } });
    }
  });
  it('#208 R3: «Otra vacuna» con nombre no pide nada', () => {
    expect(typeof validateVaccine).toBe('function');
    expect(validateVaccine({ mode: 'other', name: ' Rabia ' })).toEqual({});
  });
  it('#208 R3: con catálogo no pide nombre aunque esté vacío', () => {
    expect(typeof validateVaccine).toBe('function');
    expect(validateVaccine({ mode: 'catalog', name: '' })).toEqual({});
  });
});
