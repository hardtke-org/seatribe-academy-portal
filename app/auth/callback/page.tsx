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

    // Check if already signed in (hash token already processed by Supabase client)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(next)
        return
      }

      // Handle PKCE flow (code in query string — from OTP magic links)
      const code = searchParams.get('code')
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
          if (!error) {
            router.replace(next)
          } else {
            router.replace('/login?error=auth_callback_error')
          }
        })
        return
      }

      // Handle implicit flow (hash token — from inviteUserByEmail)
      // The @supabase/ssr browser client automatically reads the hash and fires SIGNED_IN
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe()
          router.replace(next)
        }
      })

      // Fallback: redirect to login after 5s if nothing happens
      const timeout = setTimeout(() => {
        subscription.unsubscribe()
        router.replace('/login?error=auth_callback_error')
      }, 5000)

      return () => {
        subscription.unsubscribe()
        clearTimeout(timeout)
      }
    })
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
