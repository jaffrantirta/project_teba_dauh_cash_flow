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
        <h1 className="text-xl font-bold text-gray-900">Anggota</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola daftar anggota keluarga yang dapat menyetor kas
        </p>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Tambah Anggota Baru</p>
        <AddMemberForm />
      </div>

      {/* Members list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Belum ada anggota</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-gray-800">{member.name}</p>
                  <p className="text-xs text-gray-400">
                    Ditambah {formatDate(member.created_at)}
                  </p>
                </div>
                <form action={deleteMember.bind(null, member.id)}>
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
