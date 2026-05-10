'use client'

import { useActionState } from 'react'
import { loginAdmin } from '@/app/actions'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Password Admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="Masukkan password"
        />
      </div>

      {state && 'error' in state && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
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
