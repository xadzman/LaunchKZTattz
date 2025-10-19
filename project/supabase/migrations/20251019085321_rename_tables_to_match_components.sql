/*
  # Rename Tables to Match Component Usage

  ## Overview
  This migration renames existing tables to match the naming convention used in the React components.

  ## Changes
  - Rename `booking_requests` to `bookings`
  - Rename `mailing_list_subscribers` to `mailing_list`

  ## Security
  - Maintains existing RLS policies
  - Preserves all indexes and constraints

  ## Notes
  - Uses IF EXISTS to safely handle migrations
  - All data is preserved during rename
*/

-- Rename booking_requests to bookings if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'booking_requests'
  ) THEN
    ALTER TABLE booking_requests RENAME TO bookings;
  END IF;
END $$;

-- Rename mailing_list_subscribers to mailing_list if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'mailing_list_subscribers'
  ) THEN
    ALTER TABLE mailing_list_subscribers RENAME TO mailing_list;
  END IF;
END $$;

-- Update index names to match new table names
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_booking_requests_email'
  ) THEN
    ALTER INDEX idx_booking_requests_email RENAME TO idx_bookings_email;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_booking_requests_created_at'
  ) THEN
    ALTER INDEX idx_booking_requests_created_at RENAME TO idx_bookings_created_at;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_booking_requests_reference'
  ) THEN
    ALTER INDEX idx_booking_requests_reference RENAME TO idx_bookings_reference;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_mailing_list_email'
  ) THEN
    -- Keep this name as is
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_mailing_list_created_at'
  ) THEN
    -- Keep this name as is
  END IF;
END $$;
