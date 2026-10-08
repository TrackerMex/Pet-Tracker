import { en, es } from '../../i18n/catalog';

const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');
const enCatalog: Record<string, string> = en;
const esCatalog: Record<string, string> = es;

const copyRows = [
  ["common.noPetsBody", "Add your pet and I'll help you know where they are and how they're doing.", "Añade a tu mascota y te ayudo a saber dónde está y cómo está."],
  ["alerts.emptyBody", "All is calm. If anything happens, I'll let you know here.", "Todo está tranquilo. Si pasa algo, te aviso aquí."],
  ["reminders.emptyBody", "Once you create a reminder, I'll let you know on time.", "Cuando crees un recordatorio, te aviso a tiempo."],
  ["geofences.emptyBody", "Once there's a safe zone, I'll let you know if your pet leaves it.", "Cuando haya una zona segura, te aviso si tu mascota sale de ella."],
  ["food.noMealPlanBody", "Once there's a plan, I'll help you keep track of every meal.", "Cuando haya un plan, te ayudo a llevar la cuenta de cada comida."],
  ["docs.emptyBody", "When your pet's medical documents arrive, I'll keep them here.", "Cuando lleguen los documentos médicos de tu mascota, te los guardo aquí."],
] as const;

function languageDesign(): string {
  return readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');
}

describe('#155 R1: el copy de los vacíos existe en los dos idiomas', () => {
  it.each(copyRows)('declara %s en inglés y en español', (key, english, spanish) => {
    expect(enCatalog[key]).toBe(english);
    expect(esCatalog[key]).toBe(spanish);
  });

  it.each(copyRows.map(([key]) => key))('%s no exclama, no lleva emoji y termina en punto en los dos idiomas', (key) => {
    for (const v of [enCatalog[key], esCatalog[key]]) {
      expect(v).not.toMatch(/[!¡]/);
      expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(v).toMatch(/\.$/);
    }
  });

  it('registra las claves en la tabla de mobile-ui-language', () => {
    expect(languageDesign()).toContain('### §2.21 — Añadidos por #155 — Pingo en los estados vacíos');
  });

  it.each(copyRows.map(([key]) => key))('%s tiene fila de #155 en mobile-ui-language', (key) => {
    expect(languageDesign()).toMatch(new RegExp('\\| — \\| `'+key.replace('.', '\\.')+'`[^\\n]*← (?:añadida|cambiada) por #155 \\(R1\\)'));
  });
});
