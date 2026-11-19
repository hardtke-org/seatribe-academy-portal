'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/portal'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-Mail oder Passwort ungültig.')
      setLoading(false)
      return
    }
    router.replace(redirect)
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Bitte E-Mail-Adresse eingeben.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}` },
    })
    if (error) {
      setError('Fehler beim Senden. Bitte versuche es erneut.')
      setLoading(false)
      return
    }
    setMagicSent(true)
    setLoading(false)
  }

  if (magicSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f1ea] px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md text-center">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-xl font-serif text-[#417970] mb-2">Link verschickt!</h2>
          <p className="text-gray-500 text-sm">Schau in dein Postfach ({email}) — klick den Link und du bist drin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f1ea] px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-serif text-[#417970] text-center mb-2">Willkommen zurück</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Melde dich an, um auf deine Kurse zuzugreifen.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#417970]"
              placeholder="deine@email.de"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#417970]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#417970] text-white rounded-xl font-medium hover:bg-[#356560] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Laden…' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="text-sm text-[#417970] hover:underline disabled:opacity-50"
          >
            Passwort vergessen? Login-Link per E-Mail senden
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Noch kein Konto?{' '}
          <Link href="/kurs/pds-foundations" className="text-[#417970] hover:underline font-medium">
            Kurs kaufen
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f7f1ea]"><p className="text-gray-400">Laden…</p></div>}>
      <LoginForm />
    </Suspense>
  )
}
