/*
  # Expose database functions
  
  1. Changes
    - Grant execute permission on generate_short_code function to authenticated and anon roles
*/
-- Grant execute permission on the function to authenticated and anon roles
GRANT EXECUTE ON FUNCTION generate_short_code() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_short_code() TO anon;
