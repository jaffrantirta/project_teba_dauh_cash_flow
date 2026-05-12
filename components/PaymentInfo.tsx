import Image from 'next/image'
import { CopyButton } from './CopyButton'

interface BankMethod {
  type: 'bank'
  label: string
  logo: string
  number: string
  name: string
  accent: string
}

interface QrisMethod {
  type: 'qris'
  label: string
  logo: string
  imageUrl: string
  accent: string
}

type PaymentMethod = BankMethod | QrisMethod

export function PaymentInfo() {
  const methods: PaymentMethod[] = []

  const bcaNumber = process.env.PAYMENT_BCA_NUMBER
  const bcaName   = process.env.PAYMENT_BCA_NAME
  if (bcaNumber && bcaName) {
    methods.push({
      type: 'bank',
      label: 'Bank BCA',
      logo: '🏦',
      number: bcaNumber,
      name: bcaName,
      accent: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
    })
  }

  const jagoNumber = process.env.PAYMENT_JAGO_NUMBER
  const jagoName   = process.env.PAYMENT_JAGO_NAME
  if (jagoNumber && jagoName) {
    methods.push({
      type: 'bank',
      label: 'Bank Jago',
      logo: '🏦',
      number: jagoNumber,
      name: jagoName,
      accent: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800',
    })
  }

  const qrisUrl = process.env.PAYMENT_QRIS_URL
  if (qrisUrl) {
    methods.push({
      type: 'qris',
      label: 'QRIS',
      logo: '📱',
      imageUrl: qrisUrl,
      accent: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800',
    })
  }

  if (methods.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
        Cara Transfer Iuran
      </p>
      <div className="space-y-3">
        {methods.map((m) => (
          <div
            key={m.label}
            className={`rounded-xl border p-4 ${m.accent}`}
          >
            {m.type === 'bank' ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">{m.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                    {m.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-wider">
                      {m.number}
                    </p>
                    <CopyButton text={m.number} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">a.n. {m.name}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="flex items-center gap-3 sm:flex-col sm:gap-1 sm:items-center">
                  <span className="text-2xl">{m.logo}</span>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {m.label}
                  </p>
                </div>
                <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-purple-200 dark:border-purple-700 bg-white shrink-0">
                  <Image
                    src={m.imageUrl}
                    alt="QRIS"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:self-end">
                  Scan untuk bayar iuran
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
