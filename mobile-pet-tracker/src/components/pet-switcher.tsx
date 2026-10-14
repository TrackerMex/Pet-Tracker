import { Avatar } from 'heroui-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { PetProfile } from '../api/types';
import { CATEGORY_SLOTS } from '../utils/category-palette';
import { PetAvatar } from './pet-avatar';

interface PetSwitcherProps {
  pets: PetProfile[];
  selectedPetId: string | null;
  onSelect: (petId: string) => void;
  variant?: 'default' | 'avatars';
}

export function PetSwitcher({
  pets,
  selectedPetId,
  onSelect,
  variant = 'default',
}: PetSwitcherProps) {
  if (variant === 'avatars') {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-1.5">
          {pets.map((pet, index) => {
            const selected = pet.id === selectedPetId;
            const slot = (['amber', 'violet', 'blue', 'green', 'rose'] as const)[index % 5];

            return (
              <Pressable
                key={pet.id}
                accessibilityLabel={pet.name}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                testID={`pet-chip-${pet.id}`}
                className={selected
                  ? 'rounded-full border-2 border-accent p-0.75'
                  : 'rounded-full border-2 border-transparent p-0.75'}
                onPress={() => onSelect(pet.id)}
              >
                <View
                  testID={`pet-avatar-${pet.id}`}
                  className={`size-10 items-center justify-center overflow-hidden rounded-full ${CATEGORY_SLOTS[slot].surface}`}
                >
                  {pet.photoUrl ? (
                    <PetAvatar name={pet.name} photoUrl={pet.photoUrl} size={40} cacheKey={pet.id} testID={`pet-avatar-image-${pet.id}`} />
                  ) : (
                    <Text testID={`pet-avatar-fallback-${pet.id}`} className={`text-sm font-extrabold ${CATEGORY_SLOTS[slot].ink}`}>
                      {pet.name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2">
        {pets.map((pet) => {
          const selected = pet.id === selectedPetId;

          return (
            <Pressable
              key={pet.id}
              accessibilityLabel={pet.name}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              testID={`pet-chip-${pet.id}`}
              className={
                selected
                  ? 'items-center justify-center rounded-full border-2 border-accent bg-accent-soft p-1'
                  : 'items-center justify-center rounded-full border-2 border-transparent bg-default p-1'
              }
              onPress={() => onSelect(pet.id)}
            >
              <Avatar size="sm" variant="soft" color={selected ? 'accent' : 'default'}>
                {pet.photoUrl ? (
                  <Avatar.Image
                    testID={`pet-avatar-image-${pet.id}`}
                    source={{ uri: pet.photoUrl }}
                  />
                ) : null}
                <Avatar.Fallback testID={`pet-avatar-fallback-${pet.id}`}>
                  {pet.name.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
