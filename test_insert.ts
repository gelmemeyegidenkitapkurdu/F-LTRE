import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://oxqobtlcbksfdajnvnoz.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cW9idGxjYmtzZmRham52bm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTE3MzUsImV4cCI6MjA2NzUyNzczNX0.fIC24RysJVlnTS3LAxtqwe1luz3ED_SrfQeLnjmPnMk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('yw_magazines').insert({
    id: 'test-id-123',
    title: 'Test Title',
    dialogues: []
  });
  console.log('Error:', error);
  console.log('Data:', data);
}

test();
