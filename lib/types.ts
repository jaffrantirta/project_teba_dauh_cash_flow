export type TransactionType = 'in' | 'out'

export interface Member {
  id: string
  name: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  member_id: string | null
  category_id: string | null
  notes: string | null
  proof_image_url: string | null
  created_at: string
  members: { name: string } | null
  categories: { name: string } | null
}

export type ActionState = { error: string } | { success: true } | null
