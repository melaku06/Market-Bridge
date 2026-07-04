import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey &&
  supabaseUrl !== 'your-supabase-project-url' &&
  supabaseAnonKey !== 'your-supabase-anon-key');

// Create Supabase client only if configured, otherwise return null
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Export whether realtime is available
export const isRealtimeEnabled = isSupabaseConfigured;

// Log status in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Supabase Realtime:', isSupabaseConfigured ? 'Enabled' : 'Disabled (using local PostgreSQL)');
}

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
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'order' | 'product' | 'system' | 'promotion' | 'account' | 'inventory';
          priority: 'high' | 'medium' | 'low';
          title: string;
          message: string;
          data: string | null;
          action_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: 'order' | 'product' | 'system' | 'promotion' | 'account' | 'inventory';
          priority?: 'high' | 'medium' | 'low';
          title: string;
          message: string;
          data?: string | null;
          action_url?: string | null;
          is_read?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'order' | 'product' | 'system' | 'promotion' | 'account' | 'inventory';
          priority?: 'high' | 'medium' | 'low';
          title?: string;
          message?: string;
          data?: string | null;
          action_url?: string | null;
          is_read?: boolean;
        };
      };
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Warehouse = Database['public']['Tables']['warehouses']['Row'];
