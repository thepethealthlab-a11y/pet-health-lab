// Shared authentication helper for edge functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

export const authenticateRequest = async (req: Request): Promise<AuthenticatedUser> => {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    throw new Error('Authentication required');
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Server configuration error');
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error } = await supabaseClient.auth.getUser();
  
  if (error || !user) {
    console.error('Auth error:', error?.message);
    throw new Error('Invalid authentication token');
  }
  
  return {
    id: user.id,
    email: user.email
  };
};
