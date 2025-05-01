
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '@/types/supabase';

export type Machine = Database['public']['Tables']['machines']['Row'];
export type MachineInsert = Database['public']['Tables']['machines']['Insert'];
export type MachineUpdate = Database['public']['Tables']['machines']['Update'];

type MachineFilter = {
  equipment?: string;
  model?: string;
  serialNumber?: string;
  manufacturer?: string;
  logNo?: string;
  type?: 'ocm' | 'ppm';
};

export function useMachineOperations() {
  const { user } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMachines = async (filters?: MachineFilter) => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('machines')
        .select('*')
        .order('name');
      
      if (filters?.type === 'ocm') {
        query = query.eq('maintenance_interval', 'yearly');
      } else if (filters?.type === 'ppm') {
        query = query.eq('maintenance_interval', 'quarterly');
      }
      
      if (filters?.equipment) {
        query = query.ilike('name', `%${filters.equipment}%`);
      }
      
      if (filters?.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      
      if (filters?.serialNumber) {
        query = query.ilike('serial_number', `%${filters.serialNumber}%`);
      }
      
      if (filters?.manufacturer) {
        query = query.ilike('manufacturer', `%${filters.manufacturer}%`);
      }
      
      if (filters?.logNo) {
        query = query.ilike('log_number', `%${filters.logNo}%`);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      setMachines(data || []);
    } catch (err: any) {
      setError(err);
      toast.error(`Failed to load machines: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addMachine = async (machine: Omit<MachineInsert, 'user_id'>) => {
    if (!user) return null;

    try {
      const newMachine: MachineInsert = {
        ...machine,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('machines')
        .insert(newMachine)
        .select()
        .single();

      if (error) throw error;
      setMachines(prev => [...prev, data]);
      toast.success(`${machine.name} has been added`);
      return data;
    } catch (err: any) {
      toast.error(`Failed to add machine: ${err.message}`);
      return null;
    }
  };

  const updateMachine = async (id: string, updates: MachineUpdate) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('machines')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setMachines(prev =>
        prev.map(machine => (machine.id === id ? { ...machine, ...updates } : machine))
      );
      
      toast.success('Machine updated successfully');
      return true;
    } catch (err: any) {
      toast.error(`Failed to update machine: ${err.message}`);
      return false;
    }
  };

  const deleteMachine = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('machines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMachines(prev => prev.filter(machine => machine.id !== id));
      toast.success('Machine deleted successfully');
      return true;
    } catch (err: any) {
      toast.error(`Failed to delete machine: ${err.message}`);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchMachines();
    } else {
      setMachines([]);
      setLoading(false);
    }
  }, [user]);

  return {
    machines,
    loading,
    error,
    fetchMachines,
    addMachine,
    updateMachine,
    deleteMachine,
  };
}
