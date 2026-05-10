import Link from 'next/link'
import { logoutAdmin } from '@/app/actions'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link href="/admin" className="font-bold text-lg text-white">
            Admin Panel
          </Link>
          <div className="flex items-center gap-1 text-sm">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Transaksi
            </Link>
            <Link
              href="/admin/members"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Anggota
            </Link>
            <Link
              href="/admin/categories"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Kategori
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              target="_blank"
            >
              Dashboard ↗
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
