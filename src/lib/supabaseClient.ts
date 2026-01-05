import { createClient } from '@supabase/supabase-js'

// Obtenha as variáveis de ambiente (mais seguro)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validação para garantir que as variáveis de ambiente foram carregadas
if (!supabaseUrl) {
  throw new Error("A variável de ambiente REACT_APP_SUPABASE_URL não foi definida. Verifique seu arquivo .env.local");
}

if (!supabaseAnonKey) {
  throw new Error("A variável de ambiente REACT_APP_SUPABASE_ANON_KEY não foi definida. Verifique seu arquivo .env.local");
}

// Crie o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
