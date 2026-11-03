import { act, render, screen } from '@testing-library/react-native';
import type { ImageRef } from 'expo-image';
import { PixelRatio } from 'react-native';
import { blobatar } from 'blobatar';
import { isValidElement } from 'react';

import { PetMarkerIcon } from './pet-marker-icon';

// #230 R3: los propietarios internos de React no forman parte del dibujo SVG.
expect.addEqualityTesters([
  function svgElements(actual, expected, testers) {
    if (!isValidElement(actual) || !isValidElement(expected)) return undefined;
    return this.equals(
      [actual.type, actual.key, actual.props],
      [expected.type, expected.key, expected.props],
      testers,
    );
  },
]);

const mockToDataURL = jest.fn();
const mockUseImage = jest.fn();

jest.mock('react-native-svg', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const actual = jest.requireActual<typeof import('react-native-svg')>('react-native-svg');
  const stub = (props: Record<string, unknown>) => React.createElement(View, props);
  const Svg = React.forwardRef((props: Record<string, unknown>, ref) => {
    React.useImperativeHandle(ref, () => ({
      toDataURL: (callback: (base64: string) => void, options: object) =>
        mockToDataURL(props.testID, callback, options),
    }));
    return React.createElement(View, props);
  });
  return { __esModule: true, default: Svg, Svg, Circle: stub, ClipPath: stub, Defs: stub, G: stub, Image: stub, parse: actual.parse };
});
jest.mock('expo-image', () => ({
  __esModule: true,
  useImage: (source: { uri: string }) => mockUseImage(source),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) => tokens.map((token) => `sentinel-${token}`),
}));

const FALLBACK_ICON = { sentinel: 'fallback-icon' } as unknown as ImageRef;
const PHOTO_ICON = { sentinel: 'photo-icon' } as unknown as ImageRef;
const pet = { id: 'pet-1', name: 'Luna', photoUrl: null };
const withPhoto = { ...pet, photoUrl: 'https://cdn.example/pets/luna.jpg?X-Amz-Signature=aaa' };
const frames: FrameRequestCallback[] = [];
async function runFrame() {
  await act(async () => { frames.shift()?.(0); });
}
async function runFrames() {
  while (frames.length) await runFrame();
}

beforeEach(() => {
  jest.clearAllMocks();
  frames.length = 0;
  jest.spyOn(PixelRatio, 'get').mockReturnValue(3.5);
  jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => frames.push(callback));
  jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => undefined);
  mockToDataURL.mockImplementation(() => undefined);
  mockUseImage.mockImplementation(({ uri }: { uri: string }) => uri === 'data:image/png;base64,RkFMTEJBQ0s=' ? FALLBACK_ICON : uri === 'data:image/png;base64,UEhPVE8=' ? PHOTO_ICON : null);
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

it('#230 R1: el compositor es invisible, no recibe toques y está oculto a la accesibilidad', async () => {
  await render(<PetMarkerIcon pet={pet} onIcon={jest.fn()} />);
  const node = screen.getByTestId('map-marker-icon', { includeHiddenElements: true });
  expect(node.props.pointerEvents).toBe('none');
  expect(node.props.accessibilityElementsHidden).toBe(true);
  expect(node.props.importantForAccessibility).toBe('no-hide-descendants');
  expect(node).toHaveStyle({ position: 'absolute', top: 0, right: 0, opacity: 0.01 });
});

it('#230 R3: sin foto dibuja el blobatar de 38 sobre disco blanco con borde de 3', async () => {
  await render(<PetMarkerIcon pet={pet} onIcon={jest.fn()} />);
  const svg = screen.getByTestId('map-marker-fallback-svg', { includeHiddenElements: true });
  expect(svg.props).toMatchObject({ width: 44, height: 44, viewBox: '0 0 44 44' });
  expect(svg.props.children.map((child: { props: { testID?: string } }) => child.props.testID ?? 'defs')).toEqual([
    'defs', 'map-marker-fallback-disc', 'map-marker-blob-clip', 'map-marker-fallback-ring',
  ]);
  const clip = screen.getByTestId('map-marker-fallback-clip', { includeHiddenElements: true });
  expect(clip.props.id).toBe('map-marker-fallback-clip');
  expect(clip.props.children.props).toMatchObject({ cx: 22, cy: 22, r: 22 });
  expect(screen.getByTestId('map-marker-fallback-disc', { includeHiddenElements: true }).props).toMatchObject({
    cx: 22, cy: 22, r: 22, fill: 'sentinel-accent-foreground',
  });
  expect(screen.getByTestId('map-marker-blob-clip', { includeHiddenElements: true }).props.clipPath).toBe('url(#map-marker-fallback-clip)');
  const blob = screen.getByTestId('map-marker-blob', { includeHiddenElements: true });
  expect(blob.props.transform).toBe('translate(3 3) scale(0.38)');
  const { parse } = jest.requireActual<typeof import('react-native-svg')>('react-native-svg');
  expect(blob.props.children).toEqual(parse(blobatar('Luna'))?.children);
  expect(screen.getByTestId('map-marker-fallback-ring', { includeHiddenElements: true }).props).toMatchObject({
    cx: 22, cy: 22, r: 20.5, stroke: 'sentinel-accent-foreground', strokeWidth: 3, fill: 'none',
  });
});
