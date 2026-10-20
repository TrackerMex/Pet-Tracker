import * as ts from 'typescript';

import { en, es, type TranslationKey } from '../i18n/catalog';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');
const pairingFile = 'src/screens/pairing/index.tsx';
const readSource = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

function literalText(node: ts.Node | undefined): string | undefined {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isJsxExpression(node)) return literalText(node.expression);
  return undefined;
}

it('#188 R16/R20: declares the new theme tokens', () => {
  const theme = readSource('src/theme/global.css');
  expect(theme).toContain('--text-28: 28px');
  expect(theme).toContain('--tracking-code: 0.14em');
  expect(theme).toContain('--font-mono: monospace');
});

it('#188 R11: resolves visible copy through bilingual catalog keys registered for pairing', () => {
  const tree = ts.createSourceFile(pairingFile, readSource(pairingFile), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const keys = new Set<TranslationKey>();
  const looseCopy: string[] = [];
  const copyTable = readSource('src/__tests__/ui-copy-table.ts');
  const textProps = new Set(['title', 'body', 'label', 'placeholder', 'accessibilityLabel', 'accessibilityHint', 'description']);
  const catalogCopy = new Set<string>([...Object.values(en), ...Object.values(es)]);

  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 't') {
      const key = literalText(node.arguments[0]);
      if (key) keys.add(key as TranslationKey);
    }
    if (ts.isJsxText(node) && node.text.trim()) looseCopy.push(node.text.trim());
    if (ts.isJsxAttribute(node) && textProps.has(node.name.getText(tree))) {
      const text = literalText(node.initializer);
      if (text?.trim()) looseCopy.push(text);
    }
    if (ts.isJsxExpression(node) && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) {
      const text = literalText(node);
      if (text?.trim()) looseCopy.push(text);
    }
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && catalogCopy.has(node.text)) {
      looseCopy.push(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);

  expect(looseCopy).toEqual([]);
  expect([...keys]).toEqual(expect.arrayContaining([
    'pairing.pairCollar', 'pairing.freePlanPairPrompt', 'pairing.activationCode', 'pairing.printedOnCollarBox',
  ]));
  for (const key of keys) {
    expect(en[key]).toEqual(expect.any(String));
    expect(es[key]).toEqual(expect.any(String));
    expect(en[key].trim()).not.toBe('');
    expect(es[key].trim()).not.toBe('');
    expect(copyTable).toContain(`{ file: '${pairingFile}', key: '${key}' }`);
  }
});

it.each([
  pairingFile,
  'src/components/ping-ring.tsx',
])('#188 R12: keeps hex colors and bracket classes out of %s', (file) => {
  const source = readSource(file);
  const hexLiteral = /#(?!\d{2,3} R\d)[\da-f]{3,8}\b/i;
  expect(source).not.toMatch(hexLiteral);
  expect(source).not.toMatch(/className="[^"]*\[/);
});
