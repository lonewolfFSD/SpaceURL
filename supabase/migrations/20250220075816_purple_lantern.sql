/*
  # Create database functions
  
  1. Functions
    - `generate_short_code`: Generates a random 6-character code for shortened URLs
    
  2. Changes
    - Creates the generate_short_code function if it doesn't exist
*/

CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer := 0;
  code_exists boolean;
BEGIN
  LOOP
    -- Generate a random 6-character code
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check if the code already exists
    SELECT EXISTS (
      SELECT 1 FROM shortened_urls WHERE short_code = result
    ) INTO code_exists;
    
    -- Exit loop if we found a unique code
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN result;
END;
$$;