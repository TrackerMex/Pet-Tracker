import { Text, View } from 'react-native';
import { AlertCircle } from 'reicon-react-native';

import { useThemeColors } from '../theme/use-theme-colors';

export function FormError({ testID, message }: { testID: string; message: string }) {
  const [danger] = useThemeColors(['danger']);

  return (
    <View testID={`${testID}-row`} className="w-full flex-row items-center gap-1.5">
      <AlertCircle size={14} color={danger} />
      <Text testID={testID} selectable className="flex-1 text-13 font-semibold text-danger">
        {message}
      </Text>
    </View>
  );
}
