import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_KEY devem estar definidas no arquivo .env'
  );
}

/**
 * Cliente Supabase singleton.
 * Utiliza apenas a anon key — nunca exponha a service_role no front-end.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
