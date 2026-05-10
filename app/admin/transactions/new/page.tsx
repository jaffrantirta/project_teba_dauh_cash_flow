import { getSupabase } from '@/lib/supabase'
import { TransactionForm } from '@/components/TransactionForm'
import type { Member, Category } from '@/lib/types'

async function getData() {
  const supabase = getSupabase()
  const [membersRes, categoriesRes] = await Promise.all([
    supabase.from('members').select('*').order('name'),
    supabase.from('categories').select('*').order('name'),
  ])
  return {
    members: (membersRes.data ?? []) as Member[],
    categories: (categoriesRes.data ?? []) as Category[],
  }
}

export default async function NewTransactionPage() {
  const { members, categories } = await getData()

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Tambah Transaksi</h1>
        <p className="text-sm text-gray-500 mt-1">Catat pemasukan atau pengeluaran kas</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <TransactionForm members={members} categories={categories} />
      </div>
    </div>
  )
}
