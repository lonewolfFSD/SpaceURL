/*
  # Initial Schema for URL Shortener

  1. New Tables
    - `shortened_urls`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `original_url` (text)
      - `short_code` (text, unique)
      - `custom_alias` (text, unique, nullable)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, nullable)
    
    - `url_analytics`
      - `id` (uuid, primary key)
      - `url_id` (uuid, references shortened_urls)
      - `clicked_at` (timestamp)
      - `ip_address` (text)
      - `user_agent` (text)
      - `referrer` (text)
      - `country` (text)
      - `city` (text)
      - `device_type` (text)
      - `browser` (text)
      - `os` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their URLs
    - Add policies for analytics access
*/

-- Create shortened_urls table
CREATE TABLE IF NOT EXISTS shortened_urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  original_url text NOT NULL,
  short_code text UNIQUE NOT NULL,
  custom_alias text UNIQUE,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  click_count bigint DEFAULT 0
);

-- Create url_analytics table
CREATE TABLE IF NOT EXISTS url_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id uuid REFERENCES shortened_urls ON DELETE CASCADE,
  clicked_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  referrer text,
  country text,
  city text,
  device_type text,
  browser text,
  os text
);

-- Enable RLS
ALTER TABLE shortened_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for shortened_urls
CREATE POLICY "Users can create shortened URLs"
  ON shortened_urls
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own URLs"
  ON shortened_urls
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view URLs by short code"
  ON shortened_urls
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update their own URLs"
  ON shortened_urls
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own URLs"
  ON shortened_urls
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for url_analytics
CREATE POLICY "Analytics can be created for any URL"
  ON url_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view analytics for their URLs"
  ON url_analytics
  FOR SELECT
  TO authenticated
  USING (
    url_id IN (
      SELECT id FROM shortened_urls 
      WHERE user_id = auth.uid()
    )
  );

-- Create function to generate short code
CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer := 0;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Create function to increment click count
CREATE OR REPLACE FUNCTION increment_click_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE shortened_urls
  SET click_count = click_count + 1
  WHERE id = NEW.url_id;
  RETURN NEW;
END;
$$;

-- Create trigger to increment click count
CREATE TRIGGER increment_click_count_trigger
AFTER INSERT ON url_analytics
FOR EACH ROW
EXECUTE FUNCTION increment_click_count();