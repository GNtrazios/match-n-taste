import { createClient } from '@supabase/supabase-js'

const cookieStorage = {
  getItem(key: string) {
    const name = `${encodeURIComponent(key)}=`
    const cookie = document.cookie
      .split('; ')
      .find((cookieEntry) => cookieEntry.startsWith(name))

    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
  },
  setItem(key: string, value: string) {
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax${secure}`
  },
  removeItem(key: string) {
    document.cookie = `${encodeURIComponent(key)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
  },
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
      storage: cookieStorage,
    },
  }
)