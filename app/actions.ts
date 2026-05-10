'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSupabase } from '@/lib/supabase'
import type { ActionState } from '@/lib/types'

async function requireAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== process.env.ADMIN_SECRET) {
    redirect('/admin/login')
  }
}

// ── Auth ─────────────────────────────────────────────────────

export async function loginAdmin(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = formData.get('password') as string
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Password salah. Coba lagi.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_auth', process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  redirect('/admin')
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/admin/login')
}

// ── Members ──────────────────────────────────────────────────

export async function addMember(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'Nama anggota wajib diisi' }

  const { error } = await getSupabase().from('members').insert({ name })
  if (error) return { error: error.message }

  revalidatePath('/admin/members')
  return { success: true }
}

export async function deleteMember(id: string) {
  await requireAdmin()
  await getSupabase().from('members').delete().eq('id', id)
  revalidatePath('/admin/members')
  revalidatePath('/admin/transactions/new')
}

// ── Categories ───────────────────────────────────────────────

export async function addCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'Nama kategori wajib diisi' }

  const { error } = await getSupabase().from('categories').insert({ name })
  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  await getSupabase().from('categories').delete().eq('id', id)
  revalidatePath('/admin/categories')
  revalidatePath('/admin/transactions/new')
}

// ── Transactions ─────────────────────────────────────────────

export async function addTransaction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const type = formData.get('type') as string
  const amountStr = formData.get('amount') as string
  const memberId = formData.get('member_id') as string
  const categoryId = formData.get('category_id') as string
  const notes = (formData.get('notes') as string)?.trim() || null
  const proofFile = formData.get('proof') as File | null

  if (!['in', 'out'].includes(type)) return { error: 'Tipe transaksi tidak valid' }

  const amount = parseInt(amountStr, 10)
  if (!amount || amount <= 0) return { error: 'Jumlah harus lebih dari 0' }

  if (type === 'in' && !memberId) return { error: 'Pilih anggota yang menyetor' }
  if (type === 'out' && !categoryId) return { error: 'Pilih kategori pengeluaran' }

  let proofImageUrl: string | null = null

  if (proofFile && proofFile.size > 0) {
    const supabase = getSupabase()
    const ext = proofFile.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await proofFile.arrayBuffer())

    const { data, error: uploadError } = await supabase.storage
      .from('proofs')
      .upload(filename, buffer, { contentType: proofFile.type })

    if (uploadError) return { error: `Upload bukti gagal: ${uploadError.message}` }

    if (data) {
      const { data: { publicUrl } } = supabase.storage
        .from('proofs')
        .getPublicUrl(filename)
      proofImageUrl = publicUrl
    }
  }

  const { error } = await getSupabase().from('transactions').insert({
    type,
    amount,
    member_id: type === 'in' ? (memberId || null) : null,
    category_id: type === 'out' ? (categoryId || null) : null,
    notes,
    proof_image_url: proofImageUrl,
  })

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteTransaction(id: string) {
  await requireAdmin()
  await getSupabase().from('transactions').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin')
}
