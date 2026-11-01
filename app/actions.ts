'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { getSql } from '@/lib/db'
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

  try {
    await getSql()`insert into members (name) values (${name})`
  } catch (error) {
    console.error('[addMember]', error)
    return { error: (error as Error).message }
  }

  revalidatePath('/admin/members')
  return { success: true }
}

export async function deleteMember(id: string) {
  await requireAdmin()
  await getSql()`delete from members where id = ${id}`
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

  try {
    await getSql()`insert into categories (name) values (${name})`
  } catch (error) {
    return { error: (error as Error).message }
  }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  await getSql()`delete from categories where id = ${id}`
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
    const ext = proofFile.name.split('.').pop() ?? 'jpg'
    try {
      const blob = await put(`proofs/${Date.now()}.${ext}`, proofFile, {
        access: 'public',
        addRandomSuffix: true,
        contentType: proofFile.type,
      })
      proofImageUrl = blob.url
    } catch (error) {
      return { error: `Upload bukti gagal: ${(error as Error).message}` }
    }
  }

  try {
    await getSql()`
      insert into transactions (type, amount, member_id, category_id, notes, proof_image_url)
      values (
        ${type}, ${amount},
        ${type === 'in' ? (memberId || null) : null},
        ${type === 'out' ? (categoryId || null) : null},
        ${notes}, ${proofImageUrl}
      )`
  } catch (error) {
    return { error: (error as Error).message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteTransaction(id: string) {
  await requireAdmin()
  await getSql()`delete from transactions where id = ${id}`
  revalidatePath('/')
  revalidatePath('/admin')
}
