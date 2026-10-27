import { useLocalSearchParams } from 'expo-router';
import PetMembersScreen from '../../../screens/pet-members';

export default function PetMembersRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  return <PetMembersScreen petId={petId} />;
}
