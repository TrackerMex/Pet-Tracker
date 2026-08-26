import { TurboModuleRegistry, type TurboModule } from 'react-native';

// Sonda sin require del paquete nitro: en runtimes sin el módulo nativo
// (Expo Go, web, jest) el require de react-native-nitro-modules lanza y,
// fuera del arranque, Metro reporta ese throw a LogBox aunque el caller lo
// capture (require guardado por ErrorUtils). TurboModuleRegistry.get
// devuelve null sin lanzar (getEnforcing es el que lanza).
export function hasNitroModules(): boolean {
  try {
    return TurboModuleRegistry.get<TurboModule>('NitroModules') != null;
  } catch {
    return false;
  }
}
