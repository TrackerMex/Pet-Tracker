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

describe('#114 R1: reminders y alerts viven en la raíz de src/app', () => {
  it.each([
    ['reminders.tsx', '(tabs)/reminders.tsx', '../screens/reminders'],
    ['alerts.tsx', '(tabs)/alerts.tsx', '../screens/alerts'],
  ])('%s sustituye a %s con su import correcto', (route, oldRoute, modulePath) => {
    expect(existsSync(join(app, route))).toBe(true);
    expect(existsSync(join(app, oldRoute))).toBe(false);
    expect(readFileSync(join(app, route), 'utf8')).toContain(`from '${modulePath}'`);
  });

  it('(tabs) conserva solo las cinco pestañas', () => {
    expect(readdirSync(join(app, '(tabs)')).sort()).toEqual([
      '__tests__',
      '_layout.tsx',
      'food.tsx',
      'health.tsx',
      'home.tsx',
      'map.tsx',
      'profile.tsx',
    ]);
  });
});

describe('#95 R7: el reset de #63 queda solo donde no lo cubre el Stack', () => {
  it.each([
    ['add-reminder', 0],
    ['add-pet', 0],
    ['weight-log', 0],
    ['meal-schedule', 0],
    ['pairing', 2],
  ])('%s conserva %i useFocusEffect', (screen, count) => {
    const source = readFileSync(join(process.cwd(), 'src/screens', screen, 'index.tsx'), 'utf8');
    expect(source.match(/useFocusEffect\(/g) ?? []).toHaveLength(count);
    if (screen === 'pairing') {
      expect(source).toContain('}, [resetPairingState, selectedPetId]);');
    }
  });
});
