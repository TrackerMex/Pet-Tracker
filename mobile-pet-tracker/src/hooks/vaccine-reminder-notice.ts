import { useSyncExternalStore } from 'react';

let noticePetId: string | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function setNotice(petId: string | null) {
  if (noticePetId === petId) return;
  noticePetId = petId;
  for (const listener of listeners) listener();
}
export function showVaccineReminderNotice(petId: string) {
  setNotice(petId);
}
export function clearVaccineReminderNotice() {
  setNotice(null);
}
export function useVaccineReminderNotice(): string | null {
  return useSyncExternalStore(subscribe, () => noticePetId);
}
