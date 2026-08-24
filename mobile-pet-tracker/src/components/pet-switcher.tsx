import { Avatar } from 'heroui-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

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
              accessibilityRole="button"
              accessibilityState={{ selected }}
              testID={`pet-chip-${pet.id}`}
              className={
                selected
                  ? 'flex-row items-center gap-2 rounded-full border-2 border-accent bg-accent-soft px-3 py-2'
                  : 'flex-row items-center gap-2 rounded-full border-2 border-transparent bg-default px-3 py-2'
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
              <Text className="font-semibold text-foreground">{pet.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
