import {
  act,
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react-native';
import { blobatar } from 'blobatar';
import { StyleSheet } from 'react-native';

import { PetAvatar } from '../pet-avatar';

describe('R5: PetAvatar blobatar determinista', () => {
  afterEach(() => cleanup());

  it('produces the same SVG for the same pet name', async () => {
    const view = await render(
      <PetAvatar name="Luna" photoUrl={null} size={72} testID="pet-avatar" />,
    );
    const svg = view.getByTestId('pet-avatar').props.xml;

    expect(svg).toBe(blobatar('Luna'));
    expect(blobatar('Luna')).toBe(blobatar('Luna'));
    expect(svg).toMatchSnapshot();
  });

  it('renders an SVG fallback when the pet has no photo', async () => {
    const view = await render(
      <PetAvatar name="Milo" photoUrl={null} size={64} testID="pet-avatar" />,
    );

    expect(view.getByTestId('pet-avatar').props.xml).toContain('<svg');
    expect(view.getByTestId('pet-avatar').props.xml).toBe(blobatar('Milo'));
    expect(view.getByTestId('pet-avatar').props.width).toBe(64);
    expect(view.getByTestId('pet-avatar').props.height).toBe(64);
  });

  it('lets the real photo win over the generated avatar', async () => {
    const view = await render(
      <PetAvatar
        name="Luna"
        photoUrl="http://example.test/luna.jpg"
        size={80}
        testID="pet-avatar"
      />,
    );

    expect(view.getByTestId('pet-avatar').props.source).toEqual([
      { uri: 'http://example.test/luna.jpg' },
    ]);
    expect(view.getByTestId('pet-avatar').props.xml).toBeUndefined();
  });
});

describe('R2: PetAvatar acepta tamaño rectangular, cacheKey y degrada al fallar la foto', () => {
  afterEach(() => cleanup());

  it('pinta la foto sin radio cuando el tamaño es un rectángulo', async () => {
    const view = await render(
      <PetAvatar
        name="Luna"
        photoUrl="http://example.test/luna.jpg"
        size={{ width: 300, height: 260 }}
        testID="pet-avatar"
      />,
    );
    const style = StyleSheet.flatten(view.getByTestId('pet-avatar').props.style);

    expect(style).toMatchObject({ width: 300, height: 260 });
    expect(style.borderRadius).toBeUndefined();
  });

  it('escala el blobatar al rectángulo sin recortarlo', async () => {
    const view = await render(
      <PetAvatar
        name="Luna"
        photoUrl={null}
        size={{ width: 300, height: 260 }}
        testID="pet-avatar"
      />,
    );
    const avatar = view.getByTestId('pet-avatar');

    expect(avatar.props.xml).toBe(blobatar('Luna'));
    expect(avatar.props.width).toBe(300);
    expect(avatar.props.height).toBe(260);
    expect(avatar.props.preserveAspectRatio).toBeUndefined();
  });

  it('pasa cacheKey dentro de source', async () => {
    const view = await render(
      <PetAvatar
        name="Luna"
        photoUrl="http://example.test/luna.jpg"
        size={72}
        cacheKey="pet-1"
        testID="pet-avatar"
      />,
    );

    expect(view.getByTestId('pet-avatar').props.source).toEqual([
      { uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' },
    ]);
  });

  it('deja source intacto cuando no se pasa cacheKey', async () => {
    const view = await render(
      <PetAvatar
        name="Luna"
        photoUrl="http://example.test/luna.jpg"
        size={72}
        testID="pet-avatar"
      />,
    );

    expect(view.getByTestId('pet-avatar').props.source).toEqual([
      { uri: 'http://example.test/luna.jpg' },
    ]);
  });

  it('vuelve al blobatar cuando la foto no carga', async () => {
    const view = await render(
      <PetAvatar
        name="Luna"
        photoUrl="http://example.test/expired.jpg"
        size={{ width: 300, height: 260 }}
        testID="pet-avatar"
      />,
    );

    expect(view.getByTestId('pet-avatar').props.xml).toBeUndefined();

    await act(async () => {
      fireEvent(view.getByTestId('pet-avatar'), 'error', {
        nativeEvent: { error: 'signature expired' },
      });
    });

    expect(view.getByTestId('pet-avatar').props.xml).toContain('<svg');
    expect(view.getByTestId('pet-avatar').props.xml).toBe(blobatar('Luna'));
  });
});
