import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { Uniwind } from 'uniwind';

import { ConfirmDialog } from '../confirm-dialog';

const mockReducedMotion = jest.fn(() => false);
jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockReducedMotion(),
}));

const onCancel = jest.fn();
const onConfirm = jest.fn();
const props = {
  testID: 'dialog', visible: true, title: '¿Eliminar Casa?', body: 'Esta acción no se puede deshacer.',
  cancelLabel: 'Cancelar', confirmLabel: 'Eliminar', onCancel, onConfirm,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockReducedMotion.mockReturnValue(false);
  jest.spyOn(Uniwind, 'getCSSVariable').mockImplementation((name) => name === '--color-shadow-25' ? 'rgba(13,17,23,0.25)' : undefined);
});
afterEach(() => jest.restoreAllMocks());

it('#202 R7: monta velo, tarjeta y acciones con las recetas del canvas', async () => {
  await render(<ConfirmDialog {...props} />);
  expect(screen.queryByTestId('dialog')).not.toBeNull();
  const modal = screen.root!;
  expect(modal.props).toMatchObject({ transparent: true, animationType: 'none', statusBarTranslucent: true, onRequestClose: onCancel });
  expect(screen.getByTestId('dialog').props.className).toBe('flex-1 justify-center px-6');
  const scrim = screen.getByTestId('dialog-scrim');
  expect(scrim.props.className).toBe('absolute inset-0');
  expect(scrim.props.accessibilityLabel).toBe('Cancelar');
  expect(scrim.parent?.props.className).toBe('absolute inset-0');
  expect(scrim.parent).toHaveStyle({ backgroundColor: 'rgba(13,17,23,0.4)' });
  expect(scrim.parent?.props.entering).toBeDefined();
  const card = screen.getByTestId('dialog-card');
  expect(card.props.role).toBe('alertdialog');
  expect(card.props.className).toBe('rounded-card border border-border bg-surface p-4 gap-3 rounded-hero px-6 pt-6 pb-3 shadow-none');
  expect(card.props.style).toEqual({ borderCurve: 'continuous', boxShadow: [{ offsetX: 0, offsetY: 12, blurRadius: 40, spreadDistance: 0, color: 'rgba(13,17,23,0.25)' }] });
  expect(card.parent?.props.entering({}).initialValues).toEqual({ opacity: 0, transform: [{ translateY: 14 }] });
  const title = within(card).getByTestId('dialog-title');
  const body = within(card).getByTestId('dialog-body');
  expect(title).toHaveTextContent('¿Eliminar Casa?');
  expect(title.props).toMatchObject({ role: 'header', className: 'text-xl font-black tracking-dialog text-foreground' });
  expect(body).toHaveTextContent('Esta acción no se puede deshacer.');
  expect(body.props.className).toBe('text-sm leading-normal text-muted');
  const cancel = within(card).getByTestId('dialog-cancel');
  const confirm = within(card).getByTestId('dialog-confirm');
  expect(card.children).toEqual([title, body, cancel.parent]);
  expect(cancel.parent?.children).toEqual([cancel, confirm]);
  expect(cancel.parent?.props.className).toBe('mt-1 flex-row justify-end gap-1');
  for (const action of [cancel, confirm]) {
    expect(action.props.role).toBe('button');
    expect(action.props.className).toBe('min-h-12 justify-center px-4');
  }
  expect(within(cancel).getByText('Cancelar').props.className).toBe('text-15 font-extrabold text-accent-strong');
  expect(within(confirm).getByText('Eliminar').props.className).toBe('text-15 font-extrabold text-danger');
});

it.each(['cancel', 'scrim', 'onRequestClose'])('#202 R7: %s llama a onCancel una vez y nunca a onConfirm', async (action) => {
  await render(<ConfirmDialog {...props} />);
  expect(screen.queryByTestId('dialog-card')).not.toBeNull();
  if (action === 'onRequestClose') await fireEvent(screen.root!, 'requestClose');
  else await fireEvent.press(screen.getByTestId(`dialog-${action}`));
  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onConfirm).not.toHaveBeenCalled();
});

it('#202 R7: confirmar llama a onConfirm una vez y nunca a onCancel', async () => {
  await render(<ConfirmDialog {...props} />);
  expect(screen.queryByTestId('dialog-card')).not.toBeNull();
  await fireEvent.press(screen.getByTestId('dialog-confirm'));
  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(onCancel).not.toHaveBeenCalled();
});

it('#202 R7: invisible no pinta el diálogo', async () => {
  await render(<ConfirmDialog {...props} visible={false} />);
  expect(screen.queryByTestId('dialog')).toBeNull();
  expect(screen.queryByTestId('dialog-card')).toBeNull();
  expect(screen.toJSON()).toBeNull();
});

it('#202 R7: reduce motion elimina la entrada del velo y de la tarjeta', async () => {
  mockReducedMotion.mockReturnValue(true);
  await render(<ConfirmDialog {...props} />);
  expect(screen.queryByTestId('dialog-card')).not.toBeNull();
  expect(screen.getByTestId('dialog-scrim').parent?.props.entering).toBeUndefined();
  expect(screen.getByTestId('dialog-card').parent?.props.entering).toBeUndefined();
});
