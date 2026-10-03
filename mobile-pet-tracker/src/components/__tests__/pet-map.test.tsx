import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { MAP_ZOOM, PetMap, type PetMapProps } from '../pet-map';

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
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
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

describe('R4: el tema decide el colorScheme del mapa', () => {
  const center = { latitude: 19.4326, longitude: -99.1332 };

  it.each([
    ['dark', 'DARK'],
    ['light', 'LIGHT'],
  ] as const)('mapea %s al valor nativo %s', async (colorScheme, expected) => {
    await render(
      <PetMap
        center={center}
        marker={null}
        polylines={[]}
        colorScheme={colorScheme}
      />,
    );

    expect(screen.getByTestId('map-view').props.colorScheme).toBe(expected);
  });
});

describe('R1 (mobile-map-zoom-controls): el wrapper oculta los controles nativos de zoom', () => {
  it('pasa solo zoomControlsEnabled y no contentPadding', async () => {
    await render(
      <PetMap
        center={{ latitude: 19.4326, longitude: -99.1332 }}
        marker={null}
        polylines={[]}
        colorScheme="light"
      />,
    );

    const mapProps = screen.getByTestId('map-view').props;

    expect(mapProps.uiSettings).toEqual({ zoomControlsEnabled: false });
    expect(mapProps).not.toHaveProperty('contentPadding');
  });
});

describe('#146 R3: PetMap pinta círculos, acepta zoom y emite el toque', () => {
  const center = { latitude: 19.4, longitude: -99.1 };
  const circle = { id: 'zone-1', center, radius: 150 };
  const mount = async (extra: Partial<PetMapProps> = {}) => {
    await render(<PetMap center={center} marker={null} polylines={[]} colorScheme="light" {...extra} />);
    return screen.getByTestId('map-view').props;
  };

  it('pasa los círculos a la vista con su id, centro y radio', async () => {
    const props = await mount({ circles: [circle] });
    expect(props.circles).toEqual([expect.objectContaining(circle)]);
  });
  it('pinta los círculos con relleno tab-pill y borde accent-strong de 2', async () => {
    const props = await mount({ circles: [circle] });
    expect(props.circles).toEqual([{ ...circle, color: 'color:tab-pill', lineColor: 'color:accent-strong', lineWidth: 2 }]);
  });
  it('usa el zoom recibido en la cámara', async () => {
    expect((await mount({ zoom: 14 })).cameraPosition.zoom).toBe(14);
  });
  it('sin zoom ni onPress conserva MAP_ZOOM, pasa una lista de círculos vacía y no registra toques', async () => {
    const props = await mount();
    expect(props.cameraPosition.zoom).toBe(16);
    expect(props.circles).toEqual([]);
    expect(props.onMapClick).toBeUndefined();
    expect(props.onPOIClick).toBeUndefined();
    expect(props.onCircleClick).toBeUndefined();
  });
  it('un toque en el mapa emite sus coordenadas', async () => {
    const onPress = jest.fn(); const props = await mount({ onPress });
    expect(typeof props.onMapClick).toBe('function');
    await fireEvent(screen.getByTestId('map-view'), 'mapClick', { coordinates: center });
    expect(onPress).toHaveBeenCalledWith(center);
  });
  it('un toque en un POI emite sus coordenadas', async () => {
    const onPress = jest.fn(); const props = await mount({ onPress });
    expect(typeof props.onPOIClick).toBe('function');
    await fireEvent(screen.getByTestId('map-view'), 'pOIClick', { coordinates: center, name: 'POI' });
    expect(onPress).toHaveBeenCalledWith(center);
  });
  it('un toque en un círculo emite el punto tocado', async () => {
    const onPress = jest.fn(); const props = await mount({ onPress });
    expect(typeof props.onCircleClick).toBe('function');
    const clickCoordinates = { latitude: 19.45, longitude: -99.2 };
    await fireEvent(screen.getByTestId('map-view'), 'circleClick', { ...circle, clickCoordinates });
    expect(onPress).toHaveBeenCalledWith(clickCoordinates);
  });
  it('ignora un toque sin latitud o sin longitud', async () => {
    const onPress = jest.fn(); const props = await mount({ onPress });
    expect(typeof props.onMapClick).toBe('function');
    expect(typeof props.onPOIClick).toBe('function');
    expect(typeof props.onCircleClick).toBe('function');
    for (const coordinates of [{ latitude: 19.4 }, { longitude: -99.1 }]) {
      await fireEvent(screen.getByTestId('map-view'), 'mapClick', { coordinates });
      await fireEvent(screen.getByTestId('map-view'), 'pOIClick', { coordinates });
      await fireEvent(screen.getByTestId('map-view'), 'circleClick', { clickCoordinates: coordinates });
    }
    expect(onPress).not.toHaveBeenCalled();
  });
});
