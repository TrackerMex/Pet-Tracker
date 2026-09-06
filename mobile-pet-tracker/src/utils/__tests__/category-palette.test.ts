import { REMINDER_TYPE_META } from '../reminder-meta';

describe('#64 R5: cada tipo de recordatorio resuelve un único hueco de la paleta', () => {
  it('conserva label y emoji mientras asigna los siete huecos exactos', () => {
    expect(REMINDER_TYPE_META).toEqual({
      vaccine: { label: 'Vaccine', emoji: '💉', category: 'blue' },
      deworming: { label: 'Deworming', emoji: '🪱', category: 'violet' },
      medication: { label: 'Medication', emoji: '💊', category: 'amber' },
      appointment: { label: 'Appointment', emoji: '🩺', category: 'green' },
      weight: { label: 'Weight', emoji: '⚖️', category: 'neutral' },
      food: { label: 'Food', emoji: '🍖', category: 'rose' },
      custom: { label: 'Other', emoji: '📌', category: 'neutral' },
    });
  });

  it('cubre exactamente los siete tipos de ReminderType', () => {
    expect(Object.keys(REMINDER_TYPE_META)).toHaveLength(7);
  });
});
