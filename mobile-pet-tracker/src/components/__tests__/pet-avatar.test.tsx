import { cleanup, render } from '@testing-library/react-native';
import { blobatar } from 'blobatar';

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
