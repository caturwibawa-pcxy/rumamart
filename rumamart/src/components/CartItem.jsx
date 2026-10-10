import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatRupiah } from '../utils/format'
import ProductImage from './ProductImage'
import QuantitySelector from './QuantitySelector'
import { TrashIcon } from './Icons'

export default function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeFromCart } = useCart()

  return (
    <li className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
      <Link to={`/product/${item.id}`} className="shrink-0 overflow-hidden rounded-xl" aria-label={`Lihat ${item.name}`}>
        <ProductImage product={item} className="h-24 w-24 sm:h-28 sm:w-28" emojiSize="text-4xl" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">{item.category}</span>
            <Link to={`/product/${item.id}`}>
              <h3 className="line-clamp-2 text-sm font-bold text-gray-900 hover:text-emerald-700 sm:text-base">
                {item.name}
              </h3>
            </Link>
            <p className="mt-0.5 text-sm text-gray-500">{formatRupiah(item.price)}</p>
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Hapus ${item.name} dari keranjang`}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <QuantitySelector
            value={item.qty}
            max={item.stock}
            label={item.name}
            onDecrease={() => decreaseQty(item.id)}
            onIncrease={() => increaseQty(item.id)}
          />
          <p className="text-base font-extrabold text-gray-900">{formatRupiah(item.price * item.qty)}</p>
        </div>
      </div>
    </li>
  )
}
