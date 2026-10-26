import VaccineCreateRoute from '../../app/pets/[petId]/vaccines/new';
import { VaccineCreateScreen } from '.';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ petId: 'pet-1' }),
  router: { push: jest.fn(), back: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() },
}));

it('#208 R4: la ruta pasa el petId de la URL a la pantalla', () => {
  const element = VaccineCreateRoute();
  expect(element.type).toBe(VaccineCreateScreen);
  expect(element.props).toEqual({ petId: 'pet-1' });
});
