import * as ts from 'typescript';

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

const screens = ['geofences', 'geofence-editor'].map(name => {
  const path = join(process.cwd(), 'src/screens', name, 'index.tsx');
  const source = readFileSync(path, 'utf8');
  return { name, source, ast: ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX) };
});
function namedImports(ast: ts.SourceFile) {
  return ast.statements.flatMap(statement => {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) return [];
    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) return [];
    const module = statement.moduleSpecifier.text;
    return bindings.elements.map(binding => ({ module, imported: binding.propertyName?.text ?? binding.name.text, local: binding.name.text }));
  });
}
function numericTextClasses(ast: ts.SourceFile) {
  const nativeText = new Set(namedImports(ast).filter(binding => binding.module === 'react-native' && binding.imported === 'Text').map(binding => binding.local));
  const findings: string[] = [];
  let customTags = 0;
  function visit(node: ts.Node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const className = node.attributes.properties.find(attribute => ts.isJsxAttribute(attribute) && attribute.name.getText(ast) === 'className');
      if (className && /\btext-(?:11|13|15|17|26)\b/.test(className.getText(ast))) {
        customTags++;
        const tag = node.tagName.getText(ast);
        if (!nativeText.has(tag)) findings.push(tag);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return { findings, customTags };
}

describe('#189 R18: candados de fuente de ambas pantallas', () => {
  it.each(screens)('#189 R18: $name no escribe hex', ({ source }) => {
    expect(source).not.toMatch(/#[\da-f]{3,8}\b/i);
  });
  it.each(screens)('#189 R18: $name no usa clases arbitrarias', ({ source }) => {
    expect(source).not.toMatch(/[\w-]+-\[[^\]]+\]/);
  });
  it.each(screens)('#189 R18: $name no crea StyleSheet', ({ source }) => {
    expect(source).not.toMatch(/StyleSheet\s*\.\s*create\s*\(/);
  });
  it.each(screens)('#189 R18: $name no pinta emojis', ({ source }) => {
    expect(source).not.toMatch(/\p{Extended_Pictographic}|\p{Regional_Indicator}/u);
  });
  it('#189 R18: Map, AlertCircle y Trash solo se importan de reicon', () => {
    const icons = screens.flatMap(({ ast }) => namedImports(ast).filter(binding => ['Map', 'AlertCircle', 'Trash'].includes(binding.imported)));
    expect(icons.map(({ imported, module }) => ({ imported, module }))).toEqual([
      { imported: 'AlertCircle', module: 'reicon-react-native' },
      { imported: 'Map', module: 'reicon-react-native' },
      { imported: 'Trash', module: 'reicon-react-native' },
    ]);
    const iconModules = screens.flatMap(({ ast }) => namedImports(ast).filter(binding => /icon|lucide|symbol/i.test(binding.module)).map(binding => binding.module));
    expect([...new Set(iconModules)]).toEqual(['reicon-react-native']);
  });
  it('#189 R18: las clases de categoría se delegan a la paleta', () => {
    for (const { source } of screens) expect(source).not.toMatch(/(?:bg|text)-category-/);
    expect(namedImports(screens[0].ast).filter(binding => binding.module === '../../utils/category-palette').map(binding => binding.imported)).toEqual(['CATEGORY_SLOTS', 'zoneCategory']);
  });
  it('#189 R18: BlurView procede de expo-blur y solo vive en Editor', () => {
    expect(namedImports(screens[0].ast).filter(binding => binding.imported === 'BlurView')).toEqual([]);
    expect(screens[0].source).not.toMatch(/<BlurView\b/);
    expect(namedImports(screens[1].ast).filter(binding => binding.imported === 'BlurView').map(binding => binding.module)).toEqual(['expo-blur']);
    expect(screens[1].source).toContain('<BlurView');
  });
  it.each(screens)('#189 R18: $name solo da tamaños propios a Text de React Native', ({ source, ast }) => {
    const result = numericTextClasses(ast);
    expect(result.customTags).toBeGreaterThan(0);
    expect(result.findings).toEqual([]);
    expect(source).not.toMatch(/text-\$\{|text-['"`]\s*\+/);
  });
});
