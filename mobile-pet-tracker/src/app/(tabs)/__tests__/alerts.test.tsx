import { screen } from '@testing-library/react-native';

import AlertsRoute from '../alerts';
import { renderWithProviders } from '../../../../test/render-with-providers';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

jest.mock('../../../screens/alerts', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    AlertsScreen: () =>
      React.createElement(View, { testID: 'alerts-screen-body' }),
  };
});

describe('#78 R5: la ruta delega en la pantalla y no es pestaña', () => {
  it('delega el renderizado en AlertsScreen', async () => {
    await renderWithProviders(<AlertsRoute />);

    expect(screen.getByTestId('alerts-screen-body')).toBeVisible();
  });

  it('mantiene TABS en cinco entradas y sin alerts', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/components/floating-tab-bar.tsx'),
      'utf8',
    );
    const tabs = source.match(/const TABS = \[([\s\S]*?)\] as const;/)?.[1] ?? '';

    expect(tabs.match(/\{ name:/g) ?? []).toHaveLength(5);
    expect(tabs).not.toContain("name: 'alerts'");
  });

  it('mantiene el layout en cinco Tabs.Screen y sin alerts', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/app/(tabs)/_layout.tsx'),
      'utf8',
    );

    expect(source.match(/<Tabs\.Screen/g) ?? []).toHaveLength(5);
    expect(source).not.toContain('<Tabs.Screen name="alerts"');
  });
});
