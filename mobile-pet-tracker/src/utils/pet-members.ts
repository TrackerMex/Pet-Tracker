export function memberInitials(firstName: string, lastName: string): string {
  return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
}

export function formatInviteCode(code: string): string {
  return code.length === 10 ? `${code.slice(0, 5)}-${code.slice(5)}` : code;
}

export function inviteDateParts(iso: string, locale: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
  };
}
