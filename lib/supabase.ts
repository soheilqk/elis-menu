import { createClient } from "@supabase/supabase-js";

// These environment variables need to be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our tables
export type Category = {
  id: number;
  created_at: string;
  title: string;
};

export type Item = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  price: number;
  image_path: string;
  category: number; // Foreign key to categories.id
};
