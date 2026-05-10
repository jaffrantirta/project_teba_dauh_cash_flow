'use client'

import { useActionState } from 'react'
import type { ActionState } from '@/lib/types'

interface Props {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  label: string
  placeholder: string
  buttonLabel: string
}

export function AddItemForm({ action, label, placeholder, buttonLabel }: Props) {
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="flex gap-3">
      <input
        name="name"
        type="text"
        required
        placeholder={placeholder}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        aria-label={label}
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
      >
        {isPending ? 'Menyimpan...' : buttonLabel}
      </button>
      {state && 'error' in state && (
        <p className="text-sm text-red-600 mt-2 absolute">{state.error}</p>
      )}
    </form>
  )
}
