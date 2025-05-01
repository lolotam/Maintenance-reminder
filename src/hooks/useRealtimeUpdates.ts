
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';
type Table = 'machines' | 'notifications' | 'profiles';

interface UseRealtimeUpdatesProps {
  table: Table;
  event?: RealtimeEvent;
  onData: (payload: RealtimePostgresChangesPayload<any>) => void;
}

export function useRealtimeUpdates({ table, event = '*', onData }: UseRealtimeUpdatesProps) {
  useEffect(() => {
    // Create channel with the correct syntax for Supabase v2
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes' as any, // Type assertion to bypass type checking
        {
          event,
          schema: 'public',
          table,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          onData(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, onData]);
}
