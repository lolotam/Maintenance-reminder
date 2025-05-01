
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
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
        },
        payload => {
          onData(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, onData]);
}
