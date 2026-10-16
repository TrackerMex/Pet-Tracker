import { Drop, ForkKnife, Pill, PinTack, Stethoscope, Syringe, Weight } from 'reicon-react-native';

import { documentCategory } from '../category-palette';
import { REMINDER_TYPE_META } from '../reminder-meta';

describe('#64 R5: cada tipo de recordatorio resuelve un único hueco de la paleta', () => {
  it('conserva label e icono mientras asigna los siete huecos exactos', () => {
    expect(REMINDER_TYPE_META).toEqual({
      vaccine: {
        labelKey: 'reminderType.vaccine',
        Icon: Syringe, // #178 R6
        category: 'blue',
      },
      deworming: {
        labelKey: 'reminderType.deworming',
        Icon: Drop,
        category: 'violet',
      },
      medication: {
        labelKey: 'reminderType.medication',
        Icon: Pill,
        category: 'amber',
      },
      appointment: {
        labelKey: 'reminderType.appointment',
        Icon: Stethoscope,
        category: 'green',
      },
      weight: {
        labelKey: 'reminderType.weight',
        Icon: Weight,
        category: 'neutral',
      },
      food: {
        labelKey: 'reminderType.food',
        Icon: ForkKnife,
        category: 'rose',
      },
      custom: {
        labelKey: 'reminderType.other',
        Icon: PinTack,
        category: 'neutral',
      },
    });
  });

  it('cubre exactamente los siete tipos de ReminderType', () => {
    expect(Object.keys(REMINDER_TYPE_META)).toHaveLength(7);
  });
});

describe('#64 R6: el tipo de documento resuelve su hueco y cae en neutral si es desconocido', () => {
  it.each([
    ['Vacunación', 'blue'],
    ['Vacunacion', 'blue'],
    ['Vaccination', 'blue'],
    ['Consulta', 'green'],
    ['Desparasitación', 'amber'],
    ['Análisis', 'violet'],
    ['  aNÁlIsIs  ', 'violet'],
  ] as const)('resuelve %j como %s', (type, expected) => {
    expect(documentCategory(type)).toBe(expected);
  });

  it.each(['Radiografía', '', 'x'.repeat(40)])(
    'resuelve el tipo desconocido %j como neutral',
    (type) => {
      expect(documentCategory(type)).toBe('neutral');
    },
  );
});
