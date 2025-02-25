import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://zxlfplrrvqzxnglgolls.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4bGZwbHJydnF6eG5nbGdvbGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODM5NzQsImV4cCI6MjA1NTk1OTk3NH0.xx6dZ3ON8PHPs5TuXqM6j3lj7jH0OTMdfK1mk7z1Xvo';

console.log('Initializing Supabase with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Check if Supabase is initialized properly
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session exists:', !!session);
}); 