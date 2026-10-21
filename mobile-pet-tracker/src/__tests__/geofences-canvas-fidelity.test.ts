declare function require(name: 'fs'): { readFileSync: (path: string, encoding: 'utf8') => string };
declare function require(name: 'path'): { join: (...paths: string[]) => string };

const { readFileSync } = require('fs');
const { join } = require('path');
const charter = readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
const mainRules = charter.split('## Animación (decisiones por defecto)')[0];
const paletteRule = charter.split('**1. Paleta pastel categórica.**')[1].split('**2. Fotografía')[0];

describe('#189 R16: la carta fija las excepciones de Zonas y Editor', () => {
  it('#189 R16.1: métricas nominales de las dos pantallas bajo A11', () => {
    expect(mainRules).toContain('Zonas seguras (#189): `paddingHorizontal: 20`, `paddingTop: 24`, `gap: 12`, `paddingBottom: insets.bottom + 40`.');
    expect(mainRules).toContain('Hoja del Editor (#189): `paddingHorizontal: 20`, `paddingTop: 12`, `gap: 14`, `paddingBottom: insets.bottom + 36`.');
  });
  it('#189 R16.2: radios nominales del tile, aviso, hoja y botones', () => {
    expect(mainRules).toContain('Fuera de la escala, por fidelidad al canvas (#189): `rounded-14` (tile de la zona), `rounded-tile` (aviso de límite), `rounded-t-hero` (hoja del Editor) y `rounded-16` (botones).');
  });
  it('#189 R16.3: receta gris, Eliminar neutro y papelera solo-icono', () => {
    expect(mainRules).toContain('sin labio; la aplican #189: Añadir zona en el límite y Guardar con nombre vacío.');
    expect(mainRules).toContain('«Eliminar» del Editor es secundario neutro con etiqueta `text-base font-extrabold text-danger`');
    expect(mainRules).toContain('La papelera de la fila de zona es una excepción solo-icono (`size-11 rounded-xl bg-danger-soft`).');
  });
  it('#189 R16.4: una sola paleta por posición para las zonas', () => {
    expect(paletteRule).toContain('`zoneCategory` (orden `green, blue, amber, violet, rose`) es el único reparto categoría → ranura de las zonas; el color es de la posición en la lista, no de la zona.');
  });
});
