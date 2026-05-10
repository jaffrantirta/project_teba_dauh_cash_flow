'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { addTransaction } from '@/app/actions'
import type { Member, Category } from '@/lib/types'

interface Props {
  members: Member[]
  categories: Category[]
}

export function TransactionForm({ members, categories }: Props) {
  const [type, setType] = useState<'in' | 'out'>('in')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [state, formAction, isPending] = useActionState(addTransaction, null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-5">
      <input type="hidden" name="type" value={type} />

      {/* Type Toggle */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Tipe Transaksi</p>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setType('in')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              type === 'in'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            + Pemasukan
          </button>
          <button
            type="button"
            onClick={() => setType('out')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              type === 'out'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            − Pengeluaran
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Jumlah (Rp) <span className="text-red-500">*</span>
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          required
          min={1}
          step={1}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="Contoh: 100000"
        />
      </div>

      {/* Conditional fields */}
      {type === 'in' ? (
        <div>
          <label htmlFor="member_id" className="block text-sm font-medium text-gray-700 mb-1">
            Dari Anggota <span className="text-red-500">*</span>
          </label>
          {members.length === 0 ? (
            <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              Belum ada anggota.{' '}
              <a href="/admin/members" className="underline font-medium">
                Tambah anggota dulu
              </a>
              .
            </p>
          ) : (
            <select
              id="member_id"
              name="member_id"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">-- Pilih anggota --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            {categories.length === 0 ? (
              <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                Belum ada kategori.{' '}
                <a href="/admin/categories" className="underline font-medium">
                  Tambah kategori dulu
                </a>
                .
              </p>
            ) : (
              <select
                id="category_id"
                name="category_id"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
              >
                <option value="">-- Pilih kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              placeholder="Keterangan pengeluaran (opsional)"
            />
          </div>
        </>
      )}

      {/* Proof image upload */}
      <div>
        <label htmlFor="proof" className="block text-sm font-medium text-gray-700 mb-1">
          Bukti Foto (opsional)
        </label>
        <input
          id="proof"
          name="proof"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
        {previewUrl && (
          <div className="mt-3 relative w-40 h-40">
            <Image
              src={previewUrl}
              alt="Preview bukti"
              fill
              className="object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      {/* Error */}
      {state && 'error' in state && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <a
          href="/admin"
          className="flex-1 py-2.5 px-4 text-center border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </a>
        <button
          type="submit"
          disabled={isPending}
          className={`flex-1 py-2.5 px-4 font-semibold text-white rounded-lg transition-colors disabled:opacity-60 ${
            type === 'in'
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </div>
    </form>
  )
}
