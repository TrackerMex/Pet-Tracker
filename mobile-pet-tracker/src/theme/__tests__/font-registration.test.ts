declare const require: (moduleName: 'fs') => {
  existsSync: (path: string) => boolean;
  readFileSync: (path: string, encoding: 'utf8') => string;
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


describe('#172 R6: el peso 800 del CTA es Inter ExtraBold', () => {
  it('#172 R6: carga Inter ExtraBold y la expone como font-extrabold', () => {
    expect(existsSync(`${projectRoot}/assets/fonts/Inter-ExtraBold.ttf`)).toBe(true);
    expect(rootLayout).toContain("'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf')");
    expect(globalCss).toContain("--font-extrabold: 'Inter-ExtraBold';");
  });
});
