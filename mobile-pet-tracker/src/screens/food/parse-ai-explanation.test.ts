import { aiExplanationPlainText, parseAiExplanation } from './parse-ai-explanation';

type TestSegment = { text: string; bold: boolean };
type TestBlock = { kind: 'paragraph' | 'bullet'; segments: TestSegment[] };

const SAMPLE = 'Rocky necesita **1200 kcal** al día: son 300 g de su alimento repartidos en tres comidas (08:00, 13:00 y 18:00).\nPara acompañarlo bien:\n- Mide la porción con una **taza dosificadora**, no a ojo.\n- Cuenta los **premios** dentro de los 300 g del día.\n- Suma un paseo corto por la tarde si hoy se movió poco.\nComo registraste alergias alimentarias, revisa la etiqueta de cualquier alimento nuevo antes de dárselo. Si algo te genera dudas, tu veterinario puede orientarte.'; // sintético
const SAMPLE_PLAIN = 'Rocky necesita 1200 kcal al día: son 300 g de su alimento repartidos en tres comidas (08:00, 13:00 y 18:00).\nPara acompañarlo bien:\nMide la porción con una taza dosificadora, no a ojo.\nCuenta los premios dentro de los 300 g del día.\nSuma un paseo corto por la tarde si hoy se movió poco.\nComo registraste alergias alimentarias, revisa la etiqueta de cualquier alimento nuevo antes de dárselo. Si algo te genera dudas, tu veterinario puede orientarte.'; // sintético

const GRAMMAR: [number, string, TestBlock[]][] = [ // sintético
  [1, 'Rocky necesita 1200 kcal al día.', [{ kind: 'paragraph', segments: [{ text: 'Rocky necesita 1200 kcal al día.', bold: false }] }]],
  [2, 'Línea uno\nLínea dos', [{ kind: 'paragraph', segments: [{ text: 'Línea uno', bold: false }] }, { kind: 'paragraph', segments: [{ text: 'Línea dos', bold: false }] }]],
  [3, 'A\n\n\nB', [{ kind: 'paragraph', segments: [{ text: 'A', bold: false }] }, { kind: 'paragraph', segments: [{ text: 'B', bold: false }] }]],
  [4, 'Intro:\n- uno\n- dos', [{ kind: 'paragraph', segments: [{ text: 'Intro:', bold: false }] }, { kind: 'bullet', segments: [{ text: 'uno', bold: false }] }, { kind: 'bullet', segments: [{ text: 'dos', bold: false }] }]],
  [5, '* uno\n* dos', [{ kind: 'bullet', segments: [{ text: 'uno', bold: false }] }, { kind: 'bullet', segments: [{ text: 'dos', bold: false }] }]],
  [6, '- a\n* b', [{ kind: 'bullet', segments: [{ text: 'a', bold: false }] }, { kind: 'bullet', segments: [{ text: 'b', bold: false }] }]],
  [7, '- a\n  - b\n    * c', [{ kind: 'bullet', segments: [{ text: 'a', bold: false }] }, { kind: 'bullet', segments: [{ text: 'b', bold: false }] }, { kind: 'bullet', segments: [{ text: 'c', bold: false }] }]],
  [8, '- Mide **300 g** al día', [{ kind: 'bullet', segments: [{ text: 'Mide ', bold: false }, { text: '300 g', bold: true }, { text: ' al día', bold: false }] }]],
  [9, '-5 grados', [{ kind: 'paragraph', segments: [{ text: '-5 grados', bold: false }] }]],
  [10, 'a\n-\n- \n*\nb', [{ kind: 'paragraph', segments: [{ text: 'a', bold: false }] }, { kind: 'paragraph', segments: [{ text: 'b', bold: false }] }]],
  [11, 'Toma **300 g** al día', [{ kind: 'paragraph', segments: [{ text: 'Toma ', bold: false }, { text: '300 g', bold: true }, { text: ' al día', bold: false }] }]],
  [12, '**Hola** mundo **fin**', [{ kind: 'paragraph', segments: [{ text: 'Hola', bold: true }, { text: ' mundo ', bold: false }, { text: 'fin', bold: true }] }]],
  [13, '**a****b**', [{ kind: 'paragraph', segments: [{ text: 'a', bold: true }, { text: 'b', bold: true }] }]],
  [14, '**Plan:** 300 g', [{ kind: 'paragraph', segments: [{ text: 'Plan:', bold: true }, { text: ' 300 g', bold: false }] }]],
  [15, '* **Mide** la porción', [{ kind: 'bullet', segments: [{ text: 'Mide', bold: true }, { text: ' la porción', bold: false }] }]],
  [16, '**- no es viñeta**', [{ kind: 'paragraph', segments: [{ text: '- no es viñeta', bold: true }] }]],
  [17, '**a**a**a', [{ kind: 'paragraph', segments: [{ text: 'a', bold: true }, { text: 'aa', bold: false }] }]],
  [18, '## Plan\nTexto', [{ kind: 'paragraph', segments: [{ text: '## Plan', bold: false }] }, { kind: 'paragraph', segments: [{ text: 'Texto', bold: false }] }]],
  [19, '1. Mide\n2. Sirve', [{ kind: 'paragraph', segments: [{ text: '1. Mide', bold: false }] }, { kind: 'paragraph', segments: [{ text: '2. Sirve', bold: false }] }]],
];

const LONG_TEXT = 'palabra '.repeat(5000).trim(); // sintético
const LINEAR_TEXT = Array.from({ length: 20000 }, () => '- **a** b').join('\n'); // sintético
const DEGRADATION: [number, unknown, TestBlock[]][] = [ // sintético
  [1, 'Esto es **importante', [{ kind: 'paragraph', segments: [{ text: 'Esto es importante', bold: false }] }]],
  [2, 'Dos * tres', [{ kind: 'paragraph', segments: [{ text: 'Dos tres', bold: false }] }]],
  [3, 'a*b', [{ kind: 'paragraph', segments: [{ text: 'ab', bold: false }] }]],
  [4, '***x***', [{ kind: 'paragraph', segments: [{ text: 'x', bold: true }] }]],
  [5, '** **', []],
  [6, '****', []],
  [7, 'Se recomienda 2 raciones al día * ver nota', [{ kind: 'paragraph', segments: [{ text: 'Se recomienda 2 raciones al día ver nota', bold: false }] }]],
  [8, '  texto   con    espacios  ', [{ kind: 'paragraph', segments: [{ text: 'texto con espacios', bold: false }] }]],
  [9, 'A\r\n- b\r\n**c**', [{ kind: 'paragraph', segments: [{ text: 'A', bold: false }] }, { kind: 'bullet', segments: [{ text: 'b', bold: false }] }, { kind: 'paragraph', segments: [{ text: 'c', bold: true }] }]],
  [10, 'A\r- b', [{ kind: 'paragraph', segments: [{ text: 'A', bold: false }] }, { kind: 'bullet', segments: [{ text: 'b', bold: false }] }]],
  [11, '', []],
  [12, '   \n\t  ', []],
  [13, null, []],
  [14, undefined, []],
  [15, 42, []],
  [16, {}, []],
  [17, LONG_TEXT, [{ kind: 'paragraph', segments: [{ text: LONG_TEXT, bold: false }] }]],
  [18, '*'.repeat(100000), []],
];

it.each(GRAMMAR)('#224 R1: fila %i de gramática', (_row, raw, expected) => {
  expect(parseAiExplanation(raw)).toEqual(expected);
});

it.each(DEGRADATION)('#224 R2: fila %i de degradación', (_row, raw, expected) => {
  expect(parseAiExplanation(raw)).toEqual(expected);
});

it('#224 R2: ninguna entrada lanza y ningún tramo contiene *', () => {
  for (const raw of [...GRAMMAR.map(row => row[1]), ...DEGRADATION.map(row => row[1]), LINEAR_TEXT]) {
    expect(() => parseAiExplanation(raw)).not.toThrow();
    expect(parseAiExplanation(raw).every((block: TestBlock) => block.segments.every((segment: TestSegment) => !segment.text.includes('*')))).toBe(true);
  }
});

it('#224 R2: es lineal en la carga de 20000 viñetas', () => {
  const blocks = parseAiExplanation(LINEAR_TEXT);
  expect(blocks).toHaveLength(20000);
  expect(blocks[0]).toEqual({ kind: 'bullet', segments: [{ text: 'a', bold: true }, { text: ' b', bold: false }] });
  expect(blocks[19999]).toEqual({ kind: 'bullet', segments: [{ text: 'a', bold: true }, { text: ' b', bold: false }] });
});

const PLAIN_CASES: [string, string][] = [ // sintético
  ['Intro:\n- uno\n- dos', 'Intro:\nuno\ndos'],
  ['- Mide **300 g** al día', 'Mide 300 g al día'],
  ['A\r\n- b\r\n**c**', 'A\nb\nc'],
  ['**a**a**a', 'aaa'],
  ['', ''],
  [SAMPLE, SAMPLE_PLAIN],
];

it.each(PLAIN_CASES)('#224 R3: texto plano de %j', (raw, expected) => {
  expect(aiExplanationPlainText(parseAiExplanation(raw))).toBe(expected);
});

it('#224 R3: SAMPLE conserva los seis bloques y las tres negritas', () => {
  const blocks = parseAiExplanation(SAMPLE);
  expect(blocks).toEqual([
    { kind: 'paragraph', segments: [{ text: 'Rocky necesita ', bold: false }, { text: '1200 kcal', bold: true }, { text: ' al día: son 300 g de su alimento repartidos en tres comidas (08:00, 13:00 y 18:00).', bold: false }] },
    { kind: 'paragraph', segments: [{ text: 'Para acompañarlo bien:', bold: false }] },
    { kind: 'bullet', segments: [{ text: 'Mide la porción con una ', bold: false }, { text: 'taza dosificadora', bold: true }, { text: ', no a ojo.', bold: false }] },
    { kind: 'bullet', segments: [{ text: 'Cuenta los ', bold: false }, { text: 'premios', bold: true }, { text: ' dentro de los 300 g del día.', bold: false }] },
    { kind: 'bullet', segments: [{ text: 'Suma un paseo corto por la tarde si hoy se movió poco.', bold: false }] },
    { kind: 'paragraph', segments: [{ text: 'Como registraste alergias alimentarias, revisa la etiqueta de cualquier alimento nuevo antes de dárselo. Si algo te genera dudas, tu veterinario puede orientarte.', bold: false }] },
  ]);
  expect(blocks.map((block: TestBlock) => block.kind)).toEqual(['paragraph', 'paragraph', 'bullet', 'bullet', 'bullet', 'paragraph']);
  expect(blocks.flatMap((block: TestBlock) => block.segments.filter((segment: TestSegment) => segment.bold).map((segment: TestSegment) => segment.text))).toEqual(['1200 kcal', 'taza dosificadora', 'premios']);
  expect(aiExplanationPlainText(blocks)).toBe(SAMPLE_PLAIN);
});
