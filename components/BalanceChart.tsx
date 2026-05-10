'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

export interface BalancePoint {
  date: string
  balance: number
}

function formatIDRShort(n: number) {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}rb`
  return String(n)
}

export function BalanceChart({ data }: { data: BalancePoint[] }) {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  if (!mounted || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        {data.length === 0 ? 'Belum ada data' : ''}
      </div>
    )
  }

  const gridColor = isDark ? '#374151' : '#f3f4f6'
  const textColor = isDark ? '#9ca3af' : '#9ca3af'
  const strokeColor = '#059669'
  const fillColor = isDark ? '#064e3b' : '#d1fae5'

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: textColor }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatIDRShort}
          tick={{ fontSize: 11, fill: textColor }}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip
          formatter={(v) =>
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(v))
          }
          contentStyle={{
            background: isDark ? '#1f2937' : '#fff',
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 12,
            color: isDark ? '#f9fafb' : '#111827',
          }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="balance"
          name="Saldo"
          stroke={strokeColor}
          strokeWidth={2}
          fill="url(#balanceGrad)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
