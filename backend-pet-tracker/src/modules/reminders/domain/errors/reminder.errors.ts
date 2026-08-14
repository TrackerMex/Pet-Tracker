export class ReminderNotFoundError extends Error {
  constructor(reminderId: string) {
    super(`Reminder ${reminderId} not found`);
    this.name = 'ReminderNotFoundError';
  }
}

export class NotReminderOwnerError extends Error {
  constructor() {
    super('Only owners can update reminders');
    this.name = 'NotReminderOwnerError';
  }
}

export class ReminderNotEditableError extends Error {
  constructor() {
    super('Reminder is not editable');
    this.name = 'ReminderNotEditableError';
  }
}
