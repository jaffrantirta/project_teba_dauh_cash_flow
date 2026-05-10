import { getSupabase } from '@/lib/supabase'
import { deleteCategory } from '@/app/actions'
import { AddCategoryForm } from '@/components/AddCategoryForm'
import { formatDate } from '@/lib/format'
import type { Category } from '@/lib/types'

async function getCategories(): Promise<Category[]> {
  const { data } = await getSupabase()
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as Category[]
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Kategori Pengeluaran</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola kategori untuk mencatat pengeluaran kas
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Tambah Kategori Baru</p>
        <AddCategoryForm />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">Belum ada kategori</div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-700">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{cat.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Ditambah {formatDate(cat.created_at)}
                  </p>
                </div>
                <form action={deleteCategory.bind(null, cat.id)}>
                  <button
                    type="submit"
                    className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1"
                  >
                    Hapus
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
