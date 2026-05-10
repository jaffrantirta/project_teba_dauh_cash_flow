'use client'

import { useRouter, usePathname } from 'next/navigation'

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

interface Props {
  years: number[]
  selectedYear: string
  selectedMonth: string
}

const selectCls =
  'px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer'

export function TransactionFilter({ years, selectedYear, selectedMonth }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function navigate(year: string, month: string) {
    const sp = new URLSearchParams()
    if (year) sp.set('year', year)
    if (month) sp.set('month', month)
    const qs = sp.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function onYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    navigate(e.target.value, '')
  }

  function onMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    navigate(selectedYear, e.target.value)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select value={selectedYear} onChange={onYearChange} className={selectCls}>
        <option value="">Semua Tahun</option>
        {years.map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>

      <select
        value={selectedMonth}
        onChange={onMonthChange}
        disabled={!selectedYear}
        className={`${selectCls} disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <option value="">Semua Bulan</option>
        {MONTHS.map((m, i) => (
          <option key={i} value={String(i + 1)}>{m}</option>
        ))}
      </select>

      {(selectedYear || selectedMonth) && (
        <button
          onClick={() => navigate('', '')}
          className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Reset ✕
        </button>
      )}
    </div>
  )
}
