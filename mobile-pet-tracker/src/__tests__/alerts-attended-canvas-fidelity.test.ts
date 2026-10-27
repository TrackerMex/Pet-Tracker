import { en, es } from '../i18n/catalog';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): { join: (...paths: string[]) => string };

const { readFileSync } = require('fs');
const { join } = require('path');
const sourceRoot = join(process.cwd(), 'src');
const readSource = (path: string) => readFileSync(join(sourceRoot, path), 'utf8');

it('#223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una', () => {
  const copy = [
    ['alerts.sectionOpen', 'Abiertas', 'Open'],
    ['alerts.attended', 'Atendidas', 'Attended'],
    ['alerts.attendedMore', 'Ver más', 'Show more'],
    ['alerts.attendedShowing', 'Mostrando {{shown}} de {{total}}', 'Showing {{shown}} of {{total}}'],
    ['alerts.calmTitle', 'Todo en calma', 'All calm'],
    ['alerts.calmBody', 'No tienes alertas abiertas. {{petName}} está tranquilo.', 'You have no open alerts. {{petName}} is calm.'],
  ] as const;
  const spanish: Record<string, string> = es;
  const english: Record<string, string> = en;
  const source = readSource('screens/alerts/index.tsx');
  for (const [key, literalEs, literalEn] of copy) {
    expect(spanish[key]).toBe(literalEs);
    expect(english[key]).toBe(literalEn);
    expect(source.split(`t('${key}'`).length - 1).toBe(1);
  }
  for (const key of ['alerts.statusAcked', 'alerts.statusClosed']) {
    expect(source.split(`t('${key}'`).length - 1).toBe(1);
  }
});
