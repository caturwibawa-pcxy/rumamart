import { Link } from 'react-router-dom'

// Tampilan kosong yang dipakai ulang (keranjang kosong, produk tidak ditemukan, 404).
export default function EmptyState({ emoji = '🛒', title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-100 text-4xl" aria-hidden="true">
        {emoji}
      </div>
      <h2 className="mt-5 text-xl font-bold text-gray-900">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
