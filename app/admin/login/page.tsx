import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
            <span className="text-2xl">🏠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Teba Dauh</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Masuk ke panel admin</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          <a href="/" className="hover:text-gray-600 dark:hover:text-gray-300 underline">
            ← Kembali ke dashboard
          </a>
        </p>
      </div>
    </div>
  )
}
