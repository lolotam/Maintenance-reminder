
export interface Machine {
  id: string;
  name: string;
  lastMaintenanceDate: string; // ISO date string
  frequency: 'Quarterly' | 'Yearly';
  nextMaintenanceDate?: string; // ISO date string
  notificationSettings?: NotificationSettings;
}

export interface NotificationSettings {
  email?: string;
  enableEmailNotifications: boolean;
  enableDesktopNotifications: boolean;
  reminderDays: number[]; // Days before due date to send reminders
}

export interface AppSettings {
  defaultEmail: string;
  enableDarkMode: boolean;
  defaultReminderDays: number[];
}
