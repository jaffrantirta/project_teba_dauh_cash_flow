'use client'

import { useActionState } from 'react'
import { addMember } from '@/app/actions'

export function AddMemberForm() {
  const [state, formAction, isPending] = useActionState(addMember, null)

  return (
    <div>
      <form action={formAction} className="flex gap-3">
        <input
          name="name"
          type="text"
          required
          placeholder="Nama anggota"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          {isPending ? 'Menyimpan...' : '+ Tambah'}
        </button>
      </form>
      {state && 'error' in state && (
        <p className="text-sm text-red-600 mt-2">{state.error}</p>
      )}
      {state && 'success' in state && (
        <p className="text-sm text-emerald-600 mt-2">Anggota berhasil ditambahkan</p>
      )}
    </div>
  )
}
