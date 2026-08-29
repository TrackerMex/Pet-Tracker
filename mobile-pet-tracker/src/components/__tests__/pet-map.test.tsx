import { render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { MAP_ZOOM, PetMap } from '../pet-map';

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

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: () => ['accent-color'],
}));

beforeEach(() => {
  mockGoogleMapsView.mockClear();
});

describe('R1: PetMap renderiza la vista de expo-maps con el contrato del tab Map', () => {
  it('usa GoogleMaps.View a pantalla completa con el testID estable', async () => {
    await render(
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

describe('R2: la cámara se fija con MAP_ZOOM en vez de deltas', () => {
  it('pasa el centro y zoom 16 sin props de región', async () => {
    const center = { latitude: 19.45, longitude: -99.12 };

    await render(
      <PetMap
        center={center}
        marker={null}
        polylines={[]}
        colorScheme="light"
      />,
    );

    const mapProps = screen.getByTestId('map-view').props;

    expect(MAP_ZOOM).toBe(16);
    expect(mapProps.cameraPosition).toEqual({ coordinates: center, zoom: 16 });
    expect(mapProps).not.toHaveProperty('initialRegion');
    expect(mapProps).not.toHaveProperty('latitudeDelta');
    expect(mapProps).not.toHaveProperty('longitudeDelta');
  });
});

describe('R3: marker y polylines llegan a la vista como arrays', () => {
  const center = { latitude: 19.4326, longitude: -99.1332 };

  it('convierte marker null en un array vacío', async () => {
    await render(
      <PetMap
        center={center}
        marker={null}
        polylines={[]}
        colorScheme="light"
      />,
    );

    expect(screen.getByTestId('map-view').props.markers).toEqual([]);
  });

  it('identifica la última posición como un único marker', async () => {
    const marker = { latitude: 19.45, longitude: -99.12 };

    await render(
      <PetMap
        center={center}
        marker={marker}
        polylines={[]}
        colorScheme="light"
      />,
    );

    expect(screen.getByTestId('map-view').props.markers).toEqual([
      { id: 'last-position', coordinates: marker },
    ]);
  });

  it('conserva orden, id y coordenadas de todas las polylines', async () => {
    const polylines = [
      {
        id: 'trip-0',
        coordinates: [
          { latitude: 19.4326, longitude: -99.1332 },
          { latitude: 19.433, longitude: -99.1328 },
        ],
      },
      {
        id: 'trip-1',
        coordinates: [
          { latitude: 19.44, longitude: -99.12 },
          { latitude: 19.45, longitude: -99.11 },
        ],
      },
    ];

    await render(
      <PetMap
        center={center}
        marker={null}
        polylines={polylines}
        colorScheme="light"
      />,
    );

    expect(screen.getByTestId('map-view').props.polylines).toEqual([
      { ...polylines[0], color: expect.any(String) },
      { ...polylines[1], color: expect.any(String) },
    ]);
  });
});
