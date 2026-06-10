import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwqaaqnafsfuzeedbbjl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cWFhcW5hZnNmdXplZWRiYmpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzA5MDQsImV4cCI6MjA5NjY0NjkwNH0.E0Y0b8A-FGymQtFri1jH4MrevFvlPlQl3vnNiU6lo50';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
