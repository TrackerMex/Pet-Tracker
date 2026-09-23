import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const app = join(process.cwd(), 'src/app');

describe('#95 R2: las seis rutas de detalle viven en la raíz de src/app', () => {
  it.each([
    ['add-reminder.tsx', '(tabs)/add-reminder.tsx', '../screens/add-reminder'],
    ['pets/add.tsx', '(tabs)/pets/add.tsx', '../../screens/add-pet'],
    ['pets/[petId]/docs.tsx', '(tabs)/pets/[petId]/docs.tsx', '../../../screens/docs'],
    ['weight-log.tsx', '(tabs)/weight-log.tsx', '../screens/weight-log'],
    ['meal-schedule.tsx', '(tabs)/meal-schedule.tsx', '../screens/meal-schedule'],
    ['pairing.tsx', '(tabs)/pairing.tsx', '../screens/pairing'],
  ])('%s sustituye a %s con su import correcto', (route, oldRoute, modulePath) => {
    expect(existsSync(join(app, route))).toBe(true);
    expect(existsSync(join(app, oldRoute))).toBe(false);
    expect(readFileSync(join(app, route), 'utf8')).toContain(`from '${modulePath}'`);
  });

  it('(tabs) conserva solo las cinco pestañas y sus dos destinos existentes', () => {
    expect(readdirSync(join(app, '(tabs)')).sort()).toEqual([
      '__tests__',
      '_layout.tsx',
      'alerts.tsx',
      'food.tsx',
      'health.tsx',
      'home.tsx',
      'map.tsx',
      'profile.tsx',
      'reminders.tsx',
    ]);
  });
});
