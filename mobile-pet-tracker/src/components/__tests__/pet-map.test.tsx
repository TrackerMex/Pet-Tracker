import { render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { PetMap } from '../pet-map';

const mockGoogleMapsView = jest.fn(
  (props: Record<string, unknown> & { children?: ReactNode }) => {
    const React = jest.requireActual<typeof import('react')>('react');
    const { View } = jest.requireActual<typeof import('react-native')>(
      'react-native',
    );

    return React.createElement(View, props, props.children);
  },
);

jest.mock('expo-maps', () => ({
  __esModule: true,
  GoogleMaps: {
    View: (props: Record<string, unknown> & { children?: ReactNode }) =>
      mockGoogleMapsView(props),
    MapColorScheme: {
      DARK: 'DARK',
      LIGHT: 'LIGHT',
      FOLLOW_SYSTEM: 'FOLLOW_SYSTEM',
    },
  },
}));

describe('R1: PetMap renderiza la vista de expo-maps con el contrato del tab Map', () => {
  it('usa GoogleMaps.View a pantalla completa con el testID estable', () => {
    render(
      <PetMap
        center={{ latitude: 19.4326, longitude: -99.1332 }}
        marker={null}
        polylines={[]}
        colorScheme="light"
      />,
    );

    expect(mockGoogleMapsView).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('map-view').props.style).toEqual({ flex: 1 });
  });
});
