import { MinusIcon, PlusIcon } from './Icons'

// Kontrol jumlah (+/-) yang dipakai di halaman Product Detail dan Cart.
export default function QuantitySelector({ value, onDecrease, onIncrease, min = 1, max = Infinity, label = 'produk' }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min}
        aria-label={`Kurangi jumlah ${label}`}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-xl text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-bold text-gray-900" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={value >= max}
        aria-label={`Tambah jumlah ${label}`}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-xl text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
