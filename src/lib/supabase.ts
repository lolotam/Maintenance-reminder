
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = 'https://fxrsuzsypswseotxzeei.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cnN1enN5cHN3c2VvdHh6ZWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NjExNDIsImV4cCI6MjA2MTEzNzE0Mn0.5Qer6PL8BeIyWHumcsM4Qn-1_rnKo0CBZrG_FPZJpTI'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
})
