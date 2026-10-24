const { readFileSync } = jest.requireActual<{
  readFileSync: (path: string, encoding: 'utf8') => string;
}>('fs');

const charter = readFileSync('../docs/ui-guidelines.md', 'utf8');
const screenSource = readFileSync('src/screens/add-pet/index.tsx', 'utf8');
const selector = readFileSync('src/components/segmented-control.tsx', 'utf8');
const heading = '## Enmienda #191 — Nueva mascota en dos pasos';
const radiusRule = 'Fuera de la escala, por fidelidad al canvas (#191): `rounded-10` (10 px) y `rounded-14` (14 px), segmentos y contenedor del selector segmentado de Nueva mascota; `rounded-tile` (18 px) de la burbuja de Pingo, que es un `View` y no un `Card`.';

it('#191 R11: la carta recoge la enmienda', () => {
  expect(charter).toContain(heading);
  const radii = charter.slice(charter.indexOf('12. **Escala de radios**'), charter.indexOf('13. **Botón con cuerpo**'));
  expect(radii).toContain(radiusRule);
  expect(charter.slice(charter.indexOf(heading))).toMatch(/- \[[ xX]\] Enmienda #191 aprobada por humano/);
});

it('#191 R11: add-pet y el selector cumplen los inventarios (enmendado por #205 R17)', () => {
  expect(screenSource.match(/\brounded-16\b/g)).toHaveLength(2);
  expect(screenSource.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(6);
  expect(selector.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2 - 1); // #205 R17
  expect(screenSource.match(/FieldErrorMessage/g)).toHaveLength(4);
  expect(screenSource.match(/\busePreventRemove\s*\(/g)).toHaveLength(1);
  for (const source of [screenSource, selector]) {
    expect(source).not.toMatch(new RegExp(String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`, 'i'));
    expect(source).not.toContain('StyleSheet');
    expect(source).not.toMatch(/\b[\w-]+-\[[^\]]+\]/);
  }
});
