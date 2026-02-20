// =============================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://mvrlprzeshdyzzrplner.supabase.co'       // e.g. https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cmxwcnplc2hkeXp6cnBsbmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDQxMDYsImV4cCI6MjA4NzE4MDEwNn0.4LvBTbZVzwARcRgsfFuQvp-7yN0ffpBo7HJqy5SaLxk'     // long string starting with eyJ...

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
