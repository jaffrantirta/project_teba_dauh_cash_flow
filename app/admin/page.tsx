import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { formatIDR, formatDate } from '@/lib/format'
import { deleteTransaction } from '@/app/actions'
import type { Transaction } from '@/lib/types'

async function getData() {
  const supabase = getSupabase()

  const [totalsRes, transactionsRes] = await Promise.all([
    supabase.from('transactions').select('type, amount'),
    supabase
      .from('transactions')
      .select('*, members(name), categories(name)')
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  const totals = totalsRes.data ?? []
  const transactions = (transactionsRes.data ?? []) as Transaction[]

  const totalMasuk = totals
    .filter((t) => t.type === 'in')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalKeluar = totals
    .filter((t) => t.type === 'out')
    .reduce((sum, t) => sum + t.amount, 0)

  return { totalMasuk, totalKeluar, transactions }
}

export default async function AdminPage() {
  const { totalMasuk, totalKeluar, transactions } = await getData()
  const saldo = totalMasuk - totalKeluar

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Saldo</p>
          <p className={`text-xl font-bold mt-1 ${saldo >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatIDR(saldo)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Total Masuk</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatIDR(totalMasuk)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Total Keluar</p>
          <p className="text-xl font-bold text-red-500 dark:text-red-400 mt-1">{formatIDR(totalKeluar)}</p>
        </div>
      </div>

      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Transaksi ({transactions.length})
        </h2>
        <Link
          href="/admin/transactions/new"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          + Tambah
        </Link>
      </div>

      {/* Transaction table — scrollable on mobile */}
      {transactions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-10 text-center text-gray-400 dark:text-gray-500">
          Belum ada transaksi.{' '}
          <Link href="/admin/transactions/new" className="text-emerald-600 dark:text-emerald-400 underline">
            Tambah sekarang
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-150">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Tanggal
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Tipe
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Dari / Kategori
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Keterangan
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Jumlah
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {transactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const isMasuk = tx.type === 'in'
  const label = isMasuk ? tx.members?.name ?? '—' : tx.categories?.name ?? '—'

  return (
    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
        {formatDate(tx.created_at)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isMasuk
              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300'
          }`}
        >
          {isMasuk ? 'Masuk' : 'Keluar'}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-700 dark:text-gray-200 font-medium">{label}</td>
      <td className="px-4 py-3 text-gray-400 dark:text-gray-500 max-w-xs truncate">
        {tx.notes ?? '—'}
        {tx.proof_image_url && (
          <a
            href={tx.proof_image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500 dark:text-blue-400 hover:underline text-xs"
          >
            Bukti
          </a>
        )}
      </td>
      <td className={`px-4 py-3 text-right font-bold ${isMasuk ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
        {isMasuk ? '+' : '−'} {formatIDR(tx.amount)}
      </td>
      <td className="px-4 py-3 text-right">
        <form action={deleteTransaction.bind(null, tx.id)}>
          <button
            type="submit"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Hapus
          </button>
        </form>
      </td>
    </tr>
  )
}
