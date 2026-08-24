import { Avatar } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';

import type { PetProfile } from '../api/types';

interface PetSwitcherProps {
  pets: PetProfile[];
  selectedPetId: string | null;
  onSelect: (petId: string) => void;
}

export function PetSwitcher({
  pets,
  selectedPetId,
  onSelect,
}: PetSwitcherProps) {
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
