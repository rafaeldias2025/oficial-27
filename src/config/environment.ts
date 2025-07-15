interface Environment {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isProduction: boolean;
  isDevelopment: boolean;
  apiUrl: string;
}

const environment: Environment = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  apiUrl: import.meta.env.PROD 
    ? 'https://api.institutodossonhos.com' 
    : 'http://localhost:3000'
};

export default environment; 