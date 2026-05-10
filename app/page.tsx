import { getSupabase } from '@/lib/supabase'
import { formatIDR, formatDate } from '@/lib/format'
import type { Transaction } from '@/lib/types'

async function getData() {
  const supabase = getSupabase()

  const [totalsRes, transactionsRes] = await Promise.all([
    supabase.from('transactions').select('type, amount'),
    supabase
      .from('transactions')
      .select('*, members(name), categories(name)')
      .order('created_at', { ascending: false })
      .limit(50),
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

export default async function DashboardPage() {
  const { totalMasuk, totalKeluar, transactions } = await getData()
  const saldo = totalMasuk - totalKeluar

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-emerald-700 text-white px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-emerald-200 text-sm font-medium uppercase tracking-wide">
            Kas Keluarga
          </p>
          <h1 className="text-2xl font-bold mt-0.5">Teba Dauh</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-sm text-gray-500 font-medium">Saldo Saat Ini</p>
          <p
            className={`text-4xl font-bold mt-1 ${
              saldo >= 0 ? 'text-emerald-700' : 'text-red-600'
            }`}
          >
            {formatIDR(saldo)}
          </p>
          <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100">
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Total Masuk</p>
              <p className="text-lg font-semibold text-emerald-600 mt-0.5">
                {formatIDR(totalMasuk)}
              </p>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Total Keluar</p>
              <p className="text-lg font-semibold text-red-500 mt-0.5">
                {formatIDR(totalKeluar)}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Riwayat Transaksi
          </h2>

          {transactions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              Belum ada transaksi
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const isMasuk = tx.type === 'in'
  const label = isMasuk ? tx.members?.name ?? '—' : tx.categories?.name ?? '—'

  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 ${
          isMasuk ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
        }`}
      >
        {isMasuk ? '↑' : '↓'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isMasuk
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {isMasuk ? 'Masuk' : 'Keluar'}
          </span>
          <span className="text-sm text-gray-700 font-medium truncate">{label}</span>
        </div>
        {tx.notes && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{tx.notes}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(tx.created_at)}</p>
      </div>

      <div className="text-right shrink-0">
        <p className={`font-bold text-sm ${isMasuk ? 'text-emerald-600' : 'text-red-500'}`}>
          {isMasuk ? '+' : '−'} {formatIDR(tx.amount)}
        </p>
        {tx.proof_image_url && (
          <a
            href={tx.proof_image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline mt-0.5 block"
          >
            Lihat Bukti
          </a>
        )}
      </div>
    </div>
  )
}
