import { render, screen } from '@testing-library/react-native';
import { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';

type ShadowStyles = Record<'card' | 'dialog' | 'floating' | 'label' | 'marker' | 'ring' | 'segment' | 'sheet' | 'tabBar' | 'toast', ViewStyle>;
const { existsSync } = jest.requireActual<{ existsSync: (path: string) => boolean }>('fs');
const useShadows = existsSync(`${process.cwd()}/src/theme/shadows.ts`)
  ? jest.requireActual<{ useShadows: () => ShadowStyles }>('../shadows').useShadows
  : undefined;
let mockResolvedColors: string[] | undefined;
const mockUseThemeColors = jest.fn((tokens: readonly string[]) =>
  mockResolvedColors ?? tokens.map(token => `--color-${token}`),
);
jest.mock('../use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) => mockUseThemeColors(tokens),
}));
let latest: ShadowStyles;
function Probe() {
  const styles = useShadows!();
  useEffect(() => { latest = styles; }, [styles]);
  return <View testID="shadows-probe" />;
}
async function renderProbe() {
  expect(useShadows).toEqual(expect.any(Function));
  return render(<Probe />);
}
beforeEach(() => {
  mockResolvedColors = undefined;
  mockUseThemeColors.mockClear();
});

describe('#197 R15: sombras del canvas', () => {
  it('#197 R15: pide los ocho colores', async () => {
    await renderProbe();
    expect(screen.getByTestId('shadows-probe')).toBeOnTheScreen();
    expect(mockUseThemeColors).toHaveBeenCalledWith(['shadow-near', 'shadow-far', 'shadow-10', 'shadow-12', 'shadow-14', 'shadow-25', 'background', 'accent']);
    expect(Object.keys(latest).sort()).toEqual(['card', 'dialog', 'floating', 'label', 'marker', 'ring', 'segment', 'sheet', 'tabBar', 'toast']);
  });
  it.each([
    ['card', { boxShadow: [{ offsetX: 0, offsetY: 1, blurRadius: 2, spreadDistance: 0, color: '--color-shadow-near' }, { offsetX: 0, offsetY: 8, blurRadius: 24, spreadDistance: 0, color: '--color-shadow-far' }] }],
    ['dialog', { boxShadow: [{ offsetX: 0, offsetY: 12, blurRadius: 40, spreadDistance: 0, color: '--color-shadow-25' }] }],
    ['floating', { boxShadow: [{ offsetX: 0, offsetY: 12, blurRadius: 32, spreadDistance: 0, color: '--color-shadow-14' }] }],
    ['label', { boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 8, spreadDistance: 0, color: '--color-shadow-12' }] }],
    ['marker', { boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 12, spreadDistance: 0, color: '--color-shadow-25' }] }],
    ['ring', { boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 3, color: '--color-background' }, { offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 5, color: '--color-accent' }] }],
    ['segment', { boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 6, spreadDistance: 0, color: '--color-shadow-10' }] }],
    ['sheet', { boxShadow: [{ offsetX: 0, offsetY: -8, blurRadius: 24, spreadDistance: 0, color: '--color-shadow-10' }] }],
    ['tabBar', { boxShadow: [{ offsetX: 0, offsetY: 10, blurRadius: 30, spreadDistance: 0, color: '--color-shadow-12' }] }],
    ['toast', { boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 8, spreadDistance: 0, color: '--color-shadow-10' }] }],
  ] as const)('#197 R15: forma de %s', async (key, style) => {
    await renderProbe();
    expect(latest[key]).toEqual(style);
  });
  it('#197 R15: conserva la referencia aunque la lista de colores sea nueva', async () => {
    const view = await renderProbe();
    const first = latest;
    await view.rerender(<Probe />);
    expect(latest).toBe(first);
  });
  it('#197 R15: re-resuelve las sombras cuando cambian los colores', async () => {
    const view = await renderProbe();
    const first = latest;
    mockResolvedColors = ['near', 'far', '10', '12', '14', '25', 'background', 'accent'];
    await view.rerender(<Probe />);
    expect(latest).not.toBe(first);
    expect(latest.card).toEqual({ boxShadow: [
      { offsetX: 0, offsetY: 1, blurRadius: 2, spreadDistance: 0, color: 'near' },
      { offsetX: 0, offsetY: 8, blurRadius: 24, spreadDistance: 0, color: 'far' },
    ] });
    expect(latest.ring).toEqual({ boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 3, color: 'background' },
      { offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 5, color: 'accent' },
    ] });
  });
});
