import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, loading, signIn, signOut };
}

export function useTable<T extends { id: string }>(tableName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async (orderBy = 'sort_order') => {
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(orderBy);
    if (error) throw error;
    setData((data as T[]) || []);
    setLoading(false);
    return (data as T[]) || [];
  };

  const fetchSingle = async (): Promise<T> => {
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .single();
    if (error) throw error;
    setLoading(false);
    return data as T;
  };

  const insert = async (record: Partial<T>): Promise<T> => {
    const { data, error } = await supabase
      .from(tableName)
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  };

  const update = async (id: string, updates: Partial<T>): Promise<T> => {
    const { data: updated, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setData((prev) => prev.map((item) => item.id === id ? (updated as T) : item));
    return updated as T;
  };

  const remove = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  };

  const updateOrder = async (items: Array<{ id: string; sort_order: number }>): Promise<void> => {
    for (const item of items) {
      await supabase
        .from(tableName)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);
    }
  };

  return { data, loading, fetchAll, fetchSingle, insert, update, remove, updateOrder };
}
