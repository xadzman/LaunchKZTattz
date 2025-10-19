/*
  # Create Contact Messages Table

  ## Overview
  This migration creates a table to store contact form submissions from the KZ Tattz website.

  ## New Tables

  ### contact_messages
  Stores all contact form messages submitted by visitors.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each message
  - `name` (text) - Sender's name
  - `email` (text) - Sender's email address
  - `message` (text) - The message content
  - `created_at` (timestamptz) - When the message was submitted

  ## Security
  - Enable Row Level Security (RLS)
  - No public access policies - data can only be accessed via service role

  ## Indexes
  - Index on email for efficient searching
  - Index on created_at for sorting and filtering

  ## Notes
  - All timestamps stored with timezone information
  - Table designed for simple contact form submissions
*/

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- No public access policies - all access via service role only
