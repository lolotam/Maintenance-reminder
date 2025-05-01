
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      machines: {
        Row: {
          id: string
          user_id: string
          name: string
          equipment_type: string
          model: string | null
          serial_number: string | null
          location: string | null
          manufacturer: string | null
          log_number: string | null
          last_maintenance_date: string | null
          next_maintenance_date: string | null
          maintenance_interval: string
          maintenance_interval_days: number
          engineer_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          equipment_type: string
          model?: string | null
          serial_number?: string | null
          location?: string | null
          manufacturer?: string | null
          log_number?: string | null
          last_maintenance_date?: string | null
          next_maintenance_date?: string | null
          maintenance_interval: string
          maintenance_interval_days: number
          engineer_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          equipment_type?: string
          model?: string | null
          serial_number?: string | null
          location?: string | null
          manufacturer?: string | null
          log_number?: string | null
          last_maintenance_date?: string | null
          next_maintenance_date?: string | null
          maintenance_interval?: string
          maintenance_interval_days?: number
          engineer_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          machine_id: string | null
          type: string
          status: string
          sent_at: string | null
          content: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          machine_id?: string | null
          type: string
          status: string
          sent_at?: string | null
          content?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          machine_id?: string | null
          type?: string
          status?: string
          sent_at?: string | null
          content?: Json | null
          created_at?: string
        }
      }
      email_templates: {
        Row: {
          id: string
          name: string
          subject: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subject: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subject?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          created_at: string | null
          updated_at: string | null
          whatsapp_enabled: boolean | null
          desktop_notifications_enabled: boolean | null
          email_notifications_enabled: boolean | null
          reminder_days: number[] | null
          whatsapp_number: string | null
          notification_settings: Json | null
        }
        Insert: {
          id: string
          email?: string | null
          created_at?: string | null
          updated_at?: string | null
          whatsapp_enabled?: boolean | null
          desktop_notifications_enabled?: boolean | null
          email_notifications_enabled?: boolean | null
          reminder_days?: number[] | null
          whatsapp_number?: string | null
          notification_settings?: Json | null
        }
        Update: {
          id?: string
          email?: string | null
          created_at?: string | null
          updated_at?: string | null
          whatsapp_enabled?: boolean | null
          desktop_notifications_enabled?: boolean | null
          email_notifications_enabled?: boolean | null
          reminder_days?: number[] | null
          whatsapp_number?: string | null
          notification_settings?: Json | null
        }
      }
      push_notification_subscriptions: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          p256dh?: string
          auth?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
