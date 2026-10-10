import { Link } from 'react-router-dom'
import { FREE_SHIPPING_MIN, useCart } from '../../context/CartContext'
import { formatRupiah } from '../../utils/format'
import CartItem from '../../components/CartItem'
import EmptyState from '../../components/EmptyState'

export default function Cart() {
  const { items, totalItems, subtotal, shippingCost, grandTotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          emoji="🛒"
          title="Keranjang kamu masih kosong."
          description="Yuk, temukan perlengkapan rumah yang kamu butuhkan."
          actionLabel="Mulai Belanja"
          actionTo="/products"
        />
      </div>
    )
  }

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_MIN - subtotal)
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_MIN) * 100))

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Keranjang Belanja</h1>
      <p className="mt-1 text-sm text-gray-500">{totalItems} item di keranjangmu</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">
        <ul className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </ul>

        <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-gray-900">Ringkasan Belanja</h2>

          {/* Progress gratis ongkir */}
          <div className="mt-4 rounded-xl bg-cream-50 p-3">
            <p className="text-xs font-medium text-gray-700">
              {remainingForFreeShipping > 0
                ? `Belanja ${formatRupiah(remainingForFreeShipping)} lagi untuk gratis ongkir`
                : 'Selamat! Kamu mendapat gratis ongkir'}
            </p>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-cream-200"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progres menuju gratis ongkir"
            >
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-semibold text-gray-900">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Ongkos kirim</dt>
              <dd className="font-semibold text-gray-900">{shippingCost === 0 ? 'Gratis' : formatRupiah(shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
              <dt className="font-bold text-gray-900">Total</dt>
              <dd className="font-extrabold text-emerald-700">{formatRupiah(grandTotal)}</dd>
            </div>
          </dl>

          <Link to="/checkout" className="btn-primary mt-5 w-full py-3">
            Lanjut ke Checkout
          </Link>
          <Link to="/products" className="mt-3 block text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Tambah produk lain
          </Link>
        </aside>
      </div>
    </div>
  )
}
