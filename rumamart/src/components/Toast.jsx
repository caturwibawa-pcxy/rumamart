import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { AlertIcon, CheckIcon, InfoIcon } from './Icons'

const styles = {
  success: { icon: CheckIcon, color: 'bg-emerald-600' },
  info: { icon: InfoIcon, color: 'bg-gray-700' },
  warning: { icon: AlertIcon, color: 'bg-amber-500' },
}

// Notifikasi singkat (Golden Rule: offer informative feedback).
// Pesan diambil dari CartContext dan hilang otomatis.
export default function Toast() {
  const { notice, dismissNotice } = useCart()

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(dismissNotice, notice.onAction ? 6000 : 3000)
    return () => clearTimeout(timer)
  }, [notice, dismissNotice])

  if (!notice) return null

  const { icon: ToastIcon, color } = styles[notice.type] ?? styles.success

  const handleAction = () => {
    notice.onAction?.()
    dismissNotice()
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className="animate-slide-up pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-gray-900 py-3 pr-3 pl-3 text-sm text-white shadow-lg"
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
          <ToastIcon className="h-4 w-4" />
        </span>
        <p className="flex-1 leading-snug">{notice.message}</p>
        {notice.actionLabel && (
          <button
            type="button"
            onClick={handleAction}
            className="cursor-pointer rounded-lg px-3 py-1.5 font-semibold text-emerald-300 transition hover:bg-white/10"
          >
            {notice.actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
