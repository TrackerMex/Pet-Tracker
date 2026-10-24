import { readFileSync } from 'fs';
import { join } from 'path';

describe('#198 R12: sombras locales de Inicio', () => {
  it('#198 R12 solo Inicio y su gráfica importan las sombras en esta feature', () => {
    for (const file of ['src/screens/home/index.tsx', 'src/screens/home/weekly-activity-chart.tsx']) {
      const source = readFileSync(join(process.cwd(), file), 'utf8');
      expect(source).toContain("import { useShadows } from '../../theme/shadows';");
    }
  });
});
