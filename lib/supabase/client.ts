import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log for debugging (remove in production)
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Missing');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  });
  throw new Error(
    'Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'customer' | 'warehouse' | 'admin';
          warehouse_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'warehouse' | 'admin';
          warehouse_id?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'warehouse' | 'admin';
          warehouse_id?: string | null;
          is_active?: boolean;
        };
      };
      warehouses: {
        Row: {
          id: string;
          name: string;
          owner_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          country: string;
          business_type: string | null;
          bank_name: string | null;
          bank_account: string | null;
          tax_id: string | null;
          status: 'pending_approval' | 'active' | 'suspended' | 'deactivated';
          member_since: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          country?: string;
          business_type?: string | null;
          bank_name?: string | null;
          bank_account?: string | null;
          tax_id?: string | null;
          status?: 'pending_approval' | 'active' | 'suspended' | 'deactivated';
          member_since?: string;
        };
        Update: {
          name?: string;
          owner_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          country?: string;
          business_type?: string | null;
          bank_name?: string | null;
          bank_account?: string | null;
          tax_id?: string | null;
          status?: 'pending_approval' | 'active' | 'suspended' | 'deactivated';
        };
      };
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Warehouse = Database['public']['Tables']['warehouses']['Row'];
