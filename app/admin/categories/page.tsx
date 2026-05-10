import { getSupabase } from '@/lib/supabase'
import { addCategory, deleteCategory } from '@/app/actions'
import { AddItemForm } from '@/components/AddItemForm'
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
        <h1 className="text-xl font-bold text-gray-900">Kategori Pengeluaran</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola kategori untuk mencatat pengeluaran kas
        </p>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Tambah Kategori Baru</p>
        <AddItemForm
          action={addCategory}
          label="Nama kategori"
          placeholder="Nama kategori"
          buttonLabel="+ Tambah"
        />
      </div>

      {/* Categories list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Belum ada kategori</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-400">
                    Ditambah {formatDate(cat.created_at)}
                  </p>
                </div>
                <form action={deleteCategory.bind(null, cat.id)}>
                  <button
                    type="submit"
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
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
