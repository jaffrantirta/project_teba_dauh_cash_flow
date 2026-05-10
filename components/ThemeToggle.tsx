'use client'

import { useTheme, type Theme } from './ThemeProvider'

const order: Theme[] = ['light', 'dark', 'system']

const config: Record<Theme, { icon: string; label: string }> = {
  light: { icon: '☀', label: 'Terang' },
  dark: { icon: '☾', label: 'Gelap' },
  system: { icon: '⊙', label: 'Sistem' },
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function cycle() {
    const idx = order.indexOf(theme)
    setTheme(order[(idx + 1) % order.length])
  }

  const { icon, label } = config[theme]

  return (
    <button
      onClick={cycle}
      title={`Mode tema: ${label}`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 dark:text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
