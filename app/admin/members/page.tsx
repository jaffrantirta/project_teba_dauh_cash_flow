import { getSupabase } from '@/lib/supabase'
import { deleteMember } from '@/app/actions'
import { AddMemberForm } from '@/components/AddMemberForm'
import { formatDate } from '@/lib/format'
import type { Member } from '@/lib/types'

async function getMembers(): Promise<Member[]> {
  const { data } = await getSupabase()
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as Member[]
}

export default async function MembersPage() {
  const members = await getMembers()

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Anggota</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola daftar anggota keluarga yang dapat menyetor kas
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Tambah Anggota Baru</p>
        <AddMemberForm />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">Belum ada anggota</div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-700">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{member.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Ditambah {formatDate(member.created_at)}
                  </p>
                </div>
                <form action={deleteMember.bind(null, member.id)}>
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
