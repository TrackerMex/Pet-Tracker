import { render } from '@testing-library/react-native';
import { useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { HeroStatusBar } from '../hero-status-bar';

jest.mock('expo-router', () => ({ useIsFocused: jest.fn() }));
jest.mock('expo-status-bar', () => ({ StatusBar: jest.fn(() => null) }));

describe('#217 R5: la barra del hero sigue el foco', () => {
  beforeEach(() => jest.clearAllMocks());

  it('#217 R5: con foco declara la barra clara', async () => {
    jest.mocked(useIsFocused).mockReturnValue(true);
    await render(<HeroStatusBar />);

    expect(jest.mocked(StatusBar).mock.calls.map(([props]) => props)).toEqual([
      { style: 'light' },
    ]);
  });

  it('#217 R5: sin foco no declara ninguna barra', async () => {
    jest.mocked(useIsFocused).mockReturnValue(false);
    const view = await render(<HeroStatusBar />);
    expect(StatusBar).not.toHaveBeenCalled();

    jest.mocked(useIsFocused).mockReturnValue(true);
    await view.rerender(<HeroStatusBar />);
    expect(jest.mocked(StatusBar).mock.calls.at(-1)?.[0]).toEqual({ style: 'light' });

    jest.mocked(StatusBar).mockClear();
    jest.mocked(useIsFocused).mockReturnValue(false);
    await view.rerender(<HeroStatusBar />);
    expect(StatusBar).not.toHaveBeenCalled();
  });
});
