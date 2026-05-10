import { getSupabase } from '@/lib/supabase'
import { formatIDR, formatDate } from '@/lib/format'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BalanceChart, type BalancePoint } from '@/components/BalanceChart'
import { MonthlyChart, type MonthlyPoint } from '@/components/MonthlyChart'
import { TransactionFilter } from '@/components/TransactionFilter'
import type { Transaction } from '@/lib/types'

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

async function getData(filterYear: number | null, filterMonth: number | null) {
  const supabase = getSupabase()

  // All transactions — used for overall balance and charts
  const allRes = await supabase
    .from('transactions')
    .select('type, amount, created_at')
    .order('created_at', { ascending: true })

  // Filtered transaction list
  let listQuery = supabase
    .from('transactions')
    .select('*, members(name), categories(name)')
    .order('created_at', { ascending: false })

  if (filterYear && filterMonth) {
    const start = new Date(filterYear, filterMonth - 1, 1).toISOString()
    const end   = new Date(filterYear, filterMonth, 1).toISOString()
    listQuery = listQuery.gte('created_at', start).lt('created_at', end)
  } else if (filterYear) {
    const start = new Date(filterYear, 0, 1).toISOString()
    const end   = new Date(filterYear + 1, 0, 1).toISOString()
    listQuery = listQuery.gte('created_at', start).lt('created_at', end)
  } else {
    listQuery = listQuery.limit(50)
  }

  const [allResult, listResult] = await Promise.all([allRes, listQuery])

  const all = allResult.data ?? []
  const transactions = (listResult.data ?? []) as Transaction[]

  // Compute overall balance + charts from all transactions
  let totalMasuk = 0
  let totalKeluar = 0
  let running = 0
  const balancePoints: BalancePoint[] = []
  const monthlyMap = new Map<string, { masuk: number; keluar: number }>()
  const yearsSet = new Set<number>()

  for (const t of all) {
    const d = new Date(t.created_at)
    yearsSet.add(d.getFullYear())
    const dateLabel = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    const monthLabel = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })

    if (t.type === 'in') { totalMasuk += t.amount; running += t.amount }
    else                  { totalKeluar += t.amount; running -= t.amount }

    balancePoints.push({ date: dateLabel, balance: running })

    const prev = monthlyMap.get(monthLabel) ?? { masuk: 0, keluar: 0 }
    monthlyMap.set(monthLabel, {
      masuk:  prev.masuk  + (t.type === 'in'  ? t.amount : 0),
      keluar: prev.keluar + (t.type === 'out' ? t.amount : 0),
    })
  }

  const monthlyPoints: MonthlyPoint[] = Array.from(monthlyMap.entries())
    .map(([month, v]) => ({ month, ...v }))

  const years = Array.from(yearsSet).sort()

  // Compute filtered period totals
  const filteredMasuk  = transactions.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0)
  const filteredKeluar = transactions.filter(t => t.type === 'out').reduce((s, t) => s + t.amount, 0)

  return {
    totalMasuk, totalKeluar,
    transactions, balancePoints, monthlyPoints,
    filteredMasuk, filteredKeluar,
    years,
  }
}

function periodLabel(year: number | null, month: number | null) {
  if (year && month) return `${MONTHS_ID[month - 1]} ${year}`
  if (year) return String(year)
  return null
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>
}) {
  const sp = await searchParams
  const filterYear  = sp.year  ? parseInt(sp.year)  : null
  const filterMonth = sp.month ? parseInt(sp.month) : null

  const {
    totalMasuk, totalKeluar,
    transactions, balancePoints, monthlyPoints,
    filteredMasuk, filteredKeluar,
    years,
  } = await getData(filterYear, filterMonth)

  const saldo = totalMasuk - totalKeluar
  const isFiltered = filterYear !== null
  const label = periodLabel(filterYear, filterMonth)

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-emerald-700 dark:bg-emerald-900 text-white px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-start justify-between gap-4">
          <div>
            <p className="text-emerald-200 text-sm font-medium uppercase tracking-wide">Kas Keluarga</p>
            <h1 className="text-2xl font-bold mt-0.5">Teba Dauh</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Saldo Saat Ini</p>
          <p className={`text-4xl font-bold mt-1 ${saldo >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatIDR(saldo)}
          </p>
          <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex-1">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Total Masuk</p>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatIDR(totalMasuk)}</p>
            </div>
            <div className="w-px bg-gray-100 dark:bg-gray-700" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Total Keluar</p>
              <p className="text-lg font-semibold text-red-500 dark:text-red-400 mt-0.5">{formatIDR(totalKeluar)}</p>
            </div>
          </div>
        </div>

        {/* Charts — always show full history */}
        {balancePoints.length > 1 && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">Grafik Saldo</p>
              <BalanceChart data={balancePoints} />
            </div>
            {monthlyPoints.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">Masuk vs Keluar per Bulan</p>
                <MonthlyChart data={monthlyPoints} />
              </div>
            )}
          </div>
        )}

        {/* Transaction list with filter */}
        <div className="space-y-3">
          {/* Filter header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Riwayat Transaksi
            </h2>
            <TransactionFilter
              years={years}
              selectedYear={sp.year ?? ''}
              selectedMonth={sp.month ?? ''}
            />
          </div>

          {/* Period summary when filter is active */}
          {isFiltered && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl px-4 py-3 flex items-center gap-4 text-sm">
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">{label}</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                Masuk: <span className="font-semibold">{formatIDR(filteredMasuk)}</span>
              </span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-red-500 dark:text-red-400">
                Keluar: <span className="font-semibold">{formatIDR(filteredKeluar)}</span>
              </span>
            </div>
          )}

          {/* List */}
          {transactions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center text-gray-400 dark:text-gray-500">
              {isFiltered ? `Tidak ada transaksi pada ${label}` : 'Belum ada transaksi'}
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
              {!isFiltered && transactions.length === 50 && (
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-2">
                  Menampilkan 50 transaksi terakhir. Gunakan filter untuk melihat periode tertentu.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const isMasuk = tx.type === 'in'
  const label = isMasuk
    ? (tx.members?.name ?? (tx.notes === 'Saldo awal' ? 'Saldo Awal' : '—'))
    : (tx.categories?.name ?? '—')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 ${
        isMasuk
          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
          : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
      }`}>
        {isMasuk ? '↑' : '↓'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isMasuk
              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300'
          }`}>
            {isMasuk ? 'Masuk' : 'Keluar'}
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-200 font-medium truncate">{label}</span>
        </div>
        {tx.notes && tx.notes !== 'Saldo awal' && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{tx.notes}</p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(tx.created_at)}</p>
      </div>

      <div className="text-right shrink-0">
        <p className={`font-bold text-sm ${isMasuk ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {isMasuk ? '+' : '−'} {formatIDR(tx.amount)}
        </p>
        {tx.proof_image_url && (
          <a
            href={tx.proof_image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 dark:text-blue-400 hover:underline mt-0.5 block"
          >
            Lihat Bukti
          </a>
        )}
      </div>
    </div>
  )
}
