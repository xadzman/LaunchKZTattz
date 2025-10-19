/*
  # Create Booking and Mailing List Tables

  ## Overview
  This migration creates the core tables for the KZ Tattz booking system and mailing list functionality
  with full GDPR compliance and audit trail capabilities.

  ## New Tables

  ### 1. booking_requests
  Stores all tattoo session booking enquiries from customers.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each booking
  - `booking_reference` (text, unique) - Human-readable booking reference number
  - `full_name` (text) - Customer's full name
  - `email` (text) - Customer's email address
  - `phone` (text, nullable) - Customer's phone number (optional)
  - `tattoo_idea` (text) - Description of the tattoo idea
  - `placement` (text) - Body placement for the tattoo
  - `budget` (text, nullable) - Budget range selected by customer
  - `preferred_date` (text, nullable) - Customer's preferred appointment date
  - `reference_image_url` (text, nullable) - URL to uploaded reference image in Supabase Storage
  - `gdpr_consent` (boolean) - Whether customer consented to be contacted
  - `gdpr_consent_text` (text) - Exact consent text shown to customer
  - `ip_address` (text, nullable) - Customer's IP address for audit trail
  - `user_agent` (text, nullable) - Browser user agent for audit trail
  - `recaptcha_score` (numeric, nullable) - reCAPTCHA score for spam detection
  - `email_sent` (boolean) - Whether confirmation email was sent successfully
  - `created_at` (timestamptz) - When the booking was created

  ### 2. mailing_list_subscribers
  Stores email subscribers for the KZ Tattz mailing list with full GDPR compliance.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each subscriber
  - `email` (text, unique) - Subscriber's email address
  - `gdpr_consent` (boolean) - Whether subscriber consented to receive emails
  - `gdpr_consent_text` (text) - Exact consent text shown to subscriber
  - `consent_timestamp` (timestamptz) - When consent was given
  - `ip_address` (text, nullable) - Subscriber's IP address for audit trail
  - `user_agent` (text, nullable) - Browser user agent for audit trail
  - `subscription_source` (text) - Where the subscription originated (e.g., 'website_form')
  - `email_sent` (boolean) - Whether welcome email was sent successfully
  - `created_at` (timestamptz) - When the subscription was created

  ## Security
  - Enable Row Level Security (RLS) on both tables
  - No public access policies - data can only be accessed via service role
  - This prevents unauthorized viewing or modification of sensitive customer data

  ## Indexes
  - Index on email fields for efficient duplicate checking
  - Index on created_at for reporting and audit queries
  - Index on booking_reference for quick lookup

  ## Notes
  - All timestamps are stored with timezone information for accurate audit trails
  - IP addresses and user agents stored for GDPR compliance proof
  - Consent text stored to prove what users agreed to at time of submission
*/

-- Create booking_requests table
CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  tattoo_idea text NOT NULL,
  placement text NOT NULL,
  budget text,
  preferred_date text,
  reference_image_url text,
  gdpr_consent boolean NOT NULL DEFAULT false,
  gdpr_consent_text text NOT NULL,
  ip_address text,
  user_agent text,
  recaptcha_score numeric,
  email_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create mailing_list_subscribers table
CREATE TABLE IF NOT EXISTS mailing_list_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  gdpr_consent boolean NOT NULL DEFAULT false,
  gdpr_consent_text text NOT NULL,
  consent_timestamp timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  subscription_source text DEFAULT 'website_form',
  email_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mailing_list_subscribers ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_requests_email ON booking_requests(email);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON booking_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_requests_reference ON booking_requests(booking_reference);

CREATE INDEX IF NOT EXISTS idx_mailing_list_email ON mailing_list_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_mailing_list_created_at ON mailing_list_subscribers(created_at DESC);

-- No public access policies - all access via service role only
-- This ensures maximum security for customer data
