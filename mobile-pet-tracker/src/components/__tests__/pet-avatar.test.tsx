import { render, screen } from '@testing-library/react-native';
import { blobatar } from 'blobatar';

import { PetAvatar } from '../pet-avatar';

describe('R5: PetAvatar blobatar determinista', () => {
  it('produces the same SVG for the same pet name', async () => {
    expect(blobatar('Luna')).toBe(blobatar('Luna'));

    const first = await render(
      <PetAvatar name="Luna" photoUrl={null} size={72} testID="pet-avatar" />,
    );
    const firstXml = first.getByTestId('pet-avatar').props.xml;
    first.unmount();
    const second = await render(
      <PetAvatar name="Luna" photoUrl={null} size={72} testID="pet-avatar" />,
    );

    expect(second.getByTestId('pet-avatar').props.xml).toBe(firstXml);
    expect(firstXml).toMatchSnapshot();
  });

  it('renders an SVG fallback when the pet has no photo', async () => {
    await render(
      <PetAvatar name="Milo" photoUrl={null} size={64} testID="pet-avatar" />,
    );

    expect(screen.getByTestId('pet-avatar').props.xml).toContain('<svg');
    expect(screen.getByTestId('pet-avatar').props.width).toBe(64);
    expect(screen.getByTestId('pet-avatar').props.height).toBe(64);
  });

  it('lets the real photo win over the generated avatar', async () => {
    await render(
      <PetAvatar
        name="Luna"
        photoUrl="http://example.test/luna.jpg"
        size={80}
        testID="pet-avatar"
      />,
    );

    expect(screen.getByTestId('pet-avatar').props.source).toEqual([
      { uri: 'http://example.test/luna.jpg' },
    ]);
    expect(screen.getByTestId('pet-avatar').props.xml).toBeUndefined();
  });
});
