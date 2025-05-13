
export interface Machine {
  id: string;
  name: string;
  lastMaintenanceDate: string; // ISO date string
  frequency: 'Quarterly' | 'Yearly';
  nextMaintenanceDate?: string; // ISO date string
  notificationSettings?: NotificationSettings;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  logNo?: string;
  quarters?: {
    q1: { date: string; engineer: string };
    q2: { date: string; engineer: string };
    q3: { date: string; engineer: string };
    q4: { date: string; engineer: string };
  };
  years?: {
    '2025'?: { date: string; engineer: string };
    '2026'?: { date: string; engineer: string };
  };
  department?: string;
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
  whatsappEnabled?: boolean;
  whatsappNumber?: string;
}

export interface TemplateDownloaderProps {
  type: 'PPM' | 'OCM';
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
  className?: string;
  buttonText?: string;
}

export type ExcelTemplateType = 'PPM' | 'OCM';
