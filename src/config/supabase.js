import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ioytcjuzzxlzpzcwilma.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveXRjanV6enhsenB6Y3dpbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTEwNTgsImV4cCI6MjA4OTQ4NzA1OH0.OHryIAWNp1hQaiFdamd6WzPgVjmq-1v_Dn73jR3UV2E'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
