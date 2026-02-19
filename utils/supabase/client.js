import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Nama fungsinya adalah createBrowserClient
  // Argumennya adalah URL lalu KEY (string langsung, bukan objek)
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}