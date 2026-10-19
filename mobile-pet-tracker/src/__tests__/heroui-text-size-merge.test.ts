import * as ts from 'typescript';

interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
}

declare function require(moduleName: 'fs'): {
  readdirSync: (path: string, options: { withFileTypes: true }) => DirectoryEntry[];
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const sourceRoot = join(process.cwd(), 'src');

function sourceFiles(directory: string = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return ['__tests__', '__mocks__'].includes(entry.name) ? [] : sourceFiles(path);
      }
      return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
    });
}

function fragments(node: ts.Node): string[] {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return [node.text];
  if (ts.isTemplateExpression(node)) {
    return [node.head.text, ...node.templateSpans.map((span) => span.literal.text)];
  }
  if (ts.isConditionalExpression(node)) {
    return [...fragments(node.whenTrue), ...fragments(node.whenFalse)];
  }
  if (ts.isBinaryExpression(node) && [
    ts.SyntaxKind.PlusToken, ts.SyntaxKind.AmpersandAmpersandToken,
    ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken,
  ].includes(node.operatorToken.kind)) {
    return [...fragments(node.left), ...fragments(node.right)];
  }
  if (ts.isCallExpression(node)) return node.arguments.flatMap(fragments);
  if (ts.isArrayLiteralExpression(node)) return node.elements.flatMap(fragments);
  if (ts.isObjectLiteralExpression(node)) {
    return node.properties.flatMap((property) =>
      property.name && ts.isStringLiteral(property.name) ? [property.name.text] : []);
  }
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) return fragments(node.expression);
  return [];
}

function isOpaque(node: ts.Node): boolean {
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) return isOpaque(node.expression);
  return ts.isIdentifier(node) || ts.isPropertyAccessExpression(node);
}

function scan(fileName: string, text: string) {
  const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const heroBindings = new Set<string>();
  const cardBindings = new Set<string>();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const moduleName = statement.moduleSpecifier.text;
    const bindings = statement.importClause?.namedBindings;
    const target = moduleName === 'heroui-native' ? heroBindings
      : moduleName.endsWith('components/card') || moduleName === './card' ? cardBindings : undefined;
    if (!target || !bindings) continue;
    if (ts.isNamedImports(bindings)) {
      for (const binding of bindings.elements) target.add(binding.name.text);
    } else if (ts.isNamespaceImport(bindings)) {
      target.add(bindings.name.text);
    }
  }

  const result = { findings: [] as string[], opaque: [] as string[], heroElements: 0, cardElements: 0, classNameElements: 0 };
  function visit(node: ts.Node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      const root = tag.split('.')[0];
      const isHero = heroBindings.has(root);
      const isCard = cardBindings.has(root);
      if (isHero || isCard) {
        if (isHero) result.heroElements++;
        if (isCard) result.cardElements++;
        const attributes = node.attributes.properties;
        const className = attributes.find((attribute): attribute is ts.JsxAttribute =>
          ts.isJsxAttribute(attribute) && attribute.name.getText(source) === 'className');
        if (className) result.classNameElements++;
        const initializer = className?.initializer;
        const value = initializer && ts.isJsxExpression(initializer) ? initializer.expression : initializer;
        const location = `${fileName} ${tag}`;
        if (attributes.some(ts.isJsxSpreadAttribute) || (value && isOpaque(value))) {
          result.opaque.push(location);
        }
        for (const fragment of value ? fragments(value) : []) {
          for (const token of fragment.split(/\s+/)) {
            if (/^(?:[a-z0-9-]+:)*!?text-\d+(?:\.\d+)?$/.test(token)) {
              result.findings.push(`${location} ${token}`);
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return result;
}

const productionFiles = sourceFiles();
const tree = productionFiles.filter((path) => path.endsWith('.tsx'))
  .map((path) => scan(path.slice(sourceRoot.length + 1), readFileSync(path, 'utf8')));

describe('#187 R1: ningún componente que fusiona className lleva text-NN', () => {
  it('#187 R1: el árbol de producción no pasa text-NN a HeroUI ni a Card', () => {
    const findings = tree.flatMap((file) => file.findings);
    expect(findings).toEqual([]);
  });

  it('#187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9)', () => {
    expect(tree.filter((file) => file.heroElements > 0).length).toBeGreaterThanOrEqual(28);
    expect(tree.reduce((sum, file) => sum + file.heroElements, 0)).toBeGreaterThanOrEqual(200); // #186 R8: 211 - 12 + 1
    expect(tree.reduce((sum, file) => sum + file.cardElements, 0)).toBeGreaterThanOrEqual(42);
    expect(tree.reduce((sum, file) => sum + file.classNameElements, 0)).toBeGreaterThanOrEqual(167);
  });

  it('#187 R1: Card es el único componente local que fusiona con tailwind-merge', () => {
    expect(productionFiles.filter((path) => /from ['"]tailwind-merge['"]/.test(readFileSync(path, 'utf8')))
      .map((path) => path.slice(sourceRoot.length + 1)).sort()).toEqual(['components/card.tsx']);
  });

  it('#187 R1: los className opacos son solo los medidos', () => {
    expect(tree.flatMap((file) => file.opaque)).toEqual(['components/password-input.tsx InputGroup.Input']);
  });

  it('#187 R1: la premisa sigue viva: cn() de heroui-native descarta text-NN ante un color', () => {
    const { cn } = jest.requireActual('heroui-native/utils') as unknown as { cn: (...inputs: string[]) => string };
    expect(cn('text-13 font-semibold text-muted')).toBe('font-semibold text-muted');
    expect(cn('text-17 font-extrabold text-accent-foreground')).toBe('font-extrabold text-accent-foreground');
    expect(cn('text-17 font-extrabold')).toBe('text-17 font-extrabold');
  });

  it.each([
    ['P1', `import { Button } from 'heroui-native'; <Button.Label className="text-17 font-extrabold text-accent-foreground" />`, 1],
    ['P2', `import { Button } from 'heroui-native'; <Button.Label
      className="text-17 font-extrabold text-accent-foreground"
    />`, 1],
    ['P3', `import { Label } from 'heroui-native'; <Label.Text className="font-semibold
text-13 text-muted" />`, 1],
    ['P4', "import { Button } from 'heroui-native'; <Button.Label className={\u0060text-17 font-extrabold\u0060} />", 1],
    ['P5', "import { Button } from 'heroui-native'; <Button.Label className={\u0060text-17 ${tone}\u0060} />", 1],
    ['P6', "import { Label } from 'heroui-native'; <Label.Text className={\u0060${base} text-13\u0060} />", 1],
    ['P7', `import { Label } from 'heroui-native'; <Label.Text className={danger ? 'text-13 text-danger' : 'text-13 text-muted'} />`, 2],
    ['P8', `import { Button } from 'heroui-native'; <Button.Label className={cn('text-17', big && 'text-22')} />`, 2],
    ['P9', `import { Button as HeroButton } from 'heroui-native'; <HeroButton.Label className="text-17 font-extrabold" />`, 1],
    ['P10', `import * as Hero from 'heroui-native'; <Hero.Button.Label className="text-17 font-extrabold" />`, 1],
    ['P11', `import { Card } from '../../components/card'; <Card className="text-13 p-4" />`, 1],
    ['P12', `import { Label } from 'heroui-native'; <Label.Text className="dark:text-13 text-muted" />`, 1],
    ['P13', `import { Label } from 'heroui-native'; <Label.Text className="text-13.5 text-muted" />`, 1],
  ] as const)('#187 R1 sonda %s', (_id, code, expected) => {
    expect(scan('corpus.tsx', code).findings).toHaveLength(expected);
  });

  it.each([
    ['N1', `import { Text } from 'react-native'; <Text className="text-17 font-extrabold text-accent-foreground" />`, 0],
    ['N2', `import { Button } from 'heroui-native'; <Button.Label className="text-xs font-extrabold text-accent-foreground" />`, 0],
    ['N3', `import { Label } from 'heroui-native'; <><Label.Text className="text-2xs text-muted" /><Label.Text className="text-2xl text-muted" /></>`, 0],
    ['N4', `import { Button } from 'heroui-native'; <Button.Label className="font-extrabold" />`, 0],
    ['N5', `import Animated from 'react-native-reanimated'; <Animated.Text className="text-13 font-semibold text-muted" />`, 0],
    ['N6', `import { Text as RNText } from 'react-native'; <RNText className="text-13 text-muted" />`, 0],
  ] as const)('#187 R1 control %s', (_id, code, expected) => {
    expect(scan('corpus.tsx', code).findings).toHaveLength(expected);
  });
});


describe('#187 R5: la carta prohíbe text-NN sobre HeroUI', () => {
  it('#187 R5: la carta fija la regla y la receta con Text plano', () => {
    const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
    for (const literal of [
      '## Enmienda #187 — Tamaños de letra sobre componentes de HeroUI',
      'no se pasa nunca a un componente de',
      '<Label><Text className="text-13 font-semibold text-muted">',
      '<Button><Text className="text-17 font-extrabold text-accent-foreground">',
      'src/__tests__/heroui-text-size-merge.test.ts',
    ]) {
      expect(charter).toContain(literal);
    }
  });
});
