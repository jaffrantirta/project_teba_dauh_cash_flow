'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logoutAdmin } from '@/app/actions'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '/admin', label: 'Transaksi' },
  { href: '/admin/members', label: 'Anggota' },
  { href: '/admin/categories', label: 'Kategori' },
  { href: '/', label: 'Dashboard ↗', external: true },
]

export function AdminNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/admin" className="font-bold text-base sm:text-lg text-white shrink-0">
          Admin Panel
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-0.5 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target={l.external ? '_blank' : undefined}
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
            >
              Keluar
            </button>
          </form>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex sm:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-gray-800 px-4 py-2 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target={l.external ? '_blank' : undefined}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              {l.label}
            </Link>
          ))}
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors text-sm"
            >
              Keluar
            </button>
          </form>
        </div>
      )}
    </nav>
  )
}
