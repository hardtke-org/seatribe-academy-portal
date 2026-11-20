'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    const next = searchParams.get('next') || '/portal'

    async function handle() {
      // 1. Try PKCE flow first (code in query string — from OTP magic links)
      const code = searchParams.get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
          router.replace(next)
          return
        }
      }

      // 2. Try implicit flow (hash in URL — from inviteUserByEmail)
      const hash = window.location.hash.substring(1)
      if (hash) {
        const params = new URLSearchParams(hash)
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (!error) {
            router.replace(next)
            return
          }
        }
      }

      // 3. Already signed in?
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace(next)
        return
      }

      // 4. Nothing worked
      router.replace('/login?error=auth_callback_error')
    }

    handle()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f1ea]">
      <p className="text-gray-500 font-sans">Einloggen…</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f7f1ea]">
        <p className="text-gray-500 font-sans">Laden…</p>
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  )
}
