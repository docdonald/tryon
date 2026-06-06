import { createClient } from '@supabase/supabase-js'

// 创建简单的 Supabase 客户端用于数据库操作
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(supabaseUrl, supabaseKey)
}
