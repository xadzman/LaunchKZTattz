import { supabase } from './supabase';

export type BookingPayload = {
  full_name: string;
  email: string;
  phone?: string;
  tattoo_idea?: string;
  placement?: string;
  budget?: string;
  preferred_date?: string;
  reference_image_urls?: string[];
  consent_marketing?: boolean;
};

export async function addBookingRequest(payload: BookingPayload) {
  // generate a simple human reference like BI-2025-xxxx
  const hr = 'BI-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
  const { data, error } = await supabase
    .from('booking_requests')
    .insert([{ ...payload, booking_reference: hr }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addSubscriber(email: string, full_name?: string, source: string = 'site-form', seasonal_promo?: string) {
  const { data, error } = await supabase
    .from('mailing_list_subscribers')
    .insert([{ email, full_name, source, seasonal_promo }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
