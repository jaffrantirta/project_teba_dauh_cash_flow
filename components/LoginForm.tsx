'use client'

import { useActionState } from 'react'
import { loginAdmin } from '@/app/actions'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password Admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="Masukkan password"
        />
      </div>

      {state && 'error' in state && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-colors"
      >
        {isPending ? 'Masuk...' : 'Masuk'}
      </button>
    </form>
  )
}
