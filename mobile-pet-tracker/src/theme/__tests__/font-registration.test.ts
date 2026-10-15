declare const require: (moduleName: 'fs') => {
  existsSync: (path: string) => boolean;
  readFileSync(path: string): Buffer;
  readFileSync(path: string, encoding: 'utf8'): string;
};

const { existsSync, readFileSync } = require('fs');
const projectRoot = process.cwd();
const rootLayout = readFileSync(`${projectRoot}/src/app/_layout.tsx`, 'utf8');
const globalCss = readFileSync(`${projectRoot}/src/theme/global.css`, 'utf8');

const interFonts = [
  ['Inter-Regular', 'Inter-Regular.ttf'],
  ['Inter-Medium', 'Inter-Medium.ttf'],
  ['Inter-SemiBold', 'Inter-SemiBold.ttf'],
  ['Inter-Bold', 'Inter-Bold.ttf'],
  ['Inter-Black', 'Inter-Black.ttf'],
] as const;

describe('R3: el layout registra los pesos estáticos de Inter sin bloquear', () => {
  it('versiona los cinco archivos TTF oficiales', () => {
    for (const [, fileName] of interFonts) {
      expect(existsSync(`${projectRoot}/assets/fonts/${fileName}`)).toBe(true);
    }
  });

  it('registra cada peso con expo-font y mantiene el render inmediato', () => {
    expect(rootLayout).toContain("import { useFonts } from 'expo-font';");
    expect(rootLayout).toContain('useFonts({');

    for (const [family, fileName] of interFonts) {
      expect(rootLayout).toContain(
        `'${family}': require('../../assets/fonts/${fileName}')`,
      );
    }

    expect(rootLayout).not.toContain('return null');
  });

  it('expone cada peso como familia de Uniwind', () => {
    expect(globalCss).toContain("--font-normal: 'Inter-Regular';");
    expect(globalCss).toContain("--font-medium: 'Inter-Medium';");
    expect(globalCss).toContain("--font-semibold: 'Inter-SemiBold';");
    expect(globalCss).toContain("--font-bold: 'Inter-Bold';");
    expect(globalCss).toContain("--font-black: 'Inter-Black';");
  });
});

describe('#173 R1: registra Inter-ExtraBold como sexto peso', () => {
  const extraBoldPath = `${projectRoot}/assets/fonts/Inter-ExtraBold.ttf`;

  it('versiona el archivo TTF oficial de ExtraBold', () => {
    expect(existsSync(extraBoldPath)).toBe(true);
  });

  it('usa bytes distintos de los otros cinco pesos de Inter', () => {
    const extraBold = readFileSync(extraBoldPath);

    for (const [, fileName] of interFonts) {
      const existing = readFileSync(`${projectRoot}/assets/fonts/${fileName}`);
      expect(Buffer.compare(extraBold, existing)).not.toBe(0);
    }
  });

  it('registra ExtraBold entre Bold y Black en useFonts', () => {
    const registration = "'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf'),";
    expect(rootLayout).toContain(registration);
    expect(rootLayout.indexOf("'Inter-Bold':")).toBeLessThan(rootLayout.indexOf(registration));
    expect(rootLayout.indexOf(registration)).toBeLessThan(rootLayout.indexOf("'Inter-Black':"));
  });

  it('expone la familia ExtraBold después de Bold en Uniwind', () => {
    const declaration = "--font-extrabold: 'Inter-ExtraBold';";
    expect(globalCss).toContain(declaration);
    expect(globalCss.indexOf("--font-bold: 'Inter-Bold';")).toBeLessThan(globalCss.indexOf(declaration));
  });
});

describe('#172 R6: el peso 800 del CTA es Inter ExtraBold', () => {
  it('#172 R6: carga Inter ExtraBold y la expone como font-extrabold', () => {
    expect(existsSync(`${projectRoot}/assets/fonts/Inter-ExtraBold.ttf`)).toBe(true);
    expect(rootLayout).toContain("'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf')");
    expect(globalCss).toContain("--font-extrabold: 'Inter-ExtraBold';");
  });
});
