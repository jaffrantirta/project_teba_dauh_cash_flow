export const dynamic = 'force-dynamic'

import { getSql } from '@/lib/db'
import { TransactionForm } from '@/components/TransactionForm'
import type { Member, Category } from '@/lib/types'

async function getData() {
  const sql = getSql()
  const [members, categories] = await Promise.all([
    sql`select * from members order by name`,
    sql`select * from categories order by name`,
  ]) as [Member[], Category[]]
  return { members, categories }
}

export default async function NewTransactionPage() {
  const { members, categories } = await getData()

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tambah Transaksi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Catat pemasukan atau pengeluaran kas</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <TransactionForm members={members} categories={categories} />
      </div>
    </div>
  )
}
