import { supabase } from './supabase';

export async function verifyRecaptcha(token: string) {
  const { data, error } = await supabase.functions.invoke('verify-recaptcha', {
    body: { token }
  });
  if (error) throw error;
  return data as { success: boolean; score?: number; action?: string; };
}
