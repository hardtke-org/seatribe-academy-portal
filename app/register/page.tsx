'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function generatePassword(length = 16): string {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*'
  let password = ''
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  array.forEach(b => { password += chars[b % chars.length] })
  return password
}

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/login')
        return
      }
      setEmail(user.email || '')
      setPassword(generatePassword())
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Fehler beim Setzen des Passworts. Bitte versuche es erneut.')
      setLoading(false)
      return
    }
    router.replace('/portal')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f1ea] px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-serif text-[#417970] text-center mb-2">Willkommen!</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Bitte wähle ein Passwort für deinen Account.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#417970] font-mono"
                placeholder="Passwort eingeben"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPassword ? 'Verbergen' : 'Anzeigen'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">Sicheres Passwort wurde vorgeschlagen — du kannst es ändern.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#417970] text-white rounded-xl font-medium hover:bg-[#356560] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Wird gespeichert…' : 'Passwort setzen & loslegen →'}
          </button>
        </form>
      </div>
    </div>
  )
}
