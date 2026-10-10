import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById, products } from '../../data/products'
import { useCart } from '../../context/CartContext'
import { formatRupiah } from '../../utils/format'
import ProductImage from '../../components/ProductImage'
import ProductCard from '../../components/ProductCard'
import Rating from '../../components/Rating'
import QuantitySelector from '../../components/QuantitySelector'
import EmptyState from '../../components/EmptyState'
import { CartIcon, ShieldIcon, TruckIcon } from '../../components/Icons'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = getProductById(id)
  const [qty, setQty] = useState(1)

  // Reset jumlah saat pindah ke produk lain (misal dari "Produk Serupa")
  useEffect(() => {
    setQty(1)
  }, [id])

  if (!product) {
    return (
      <div className="container-page py-16">
        <EmptyState
          emoji="🔎"
          title="Produk tidak ditemukan"
          description="Produk yang kamu cari mungkin sudah tidak tersedia."
          actionLabel="Lihat Semua Produk"
          actionTo="/products"
        />
      </div>
    )
  }

  const outOfStock = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 10
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleBuyNow = () => {
    addToCart(product, qty, { silent: true })
    navigate('/checkout')
  }

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-emerald-700">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/products" className="hover:text-emerald-700">
              Products
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-emerald-700">
              {product.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-gray-700" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Foto produk */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <ProductImage product={product} className="aspect-square w-full" emojiSize="text-9xl" />
        </div>

        {/* Informasi produk */}
        <div>
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            {product.category}
          </Link>
          <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Rating value={product.rating} reviews={product.reviews} />
            <span className="text-sm text-gray-500">{product.sold} terjual</span>
          </div>

          <p className="mt-5 text-3xl font-extrabold text-emerald-700">{formatRupiah(product.price)}</p>

          <p
            className={`mt-2 text-sm font-semibold ${
              outOfStock ? 'text-red-600' : lowStock ? 'text-amber-600' : 'text-gray-500'
            }`}
          >
            {outOfStock ? 'Stok habis' : lowStock ? `Segera habis! Stok tinggal ${product.stock}` : `Stok tersedia: ${product.stock}`}
          </p>

          <p className="mt-5 leading-relaxed text-gray-600">{product.description}</p>

          <dl className="mt-5 divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white text-sm">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex gap-4 px-4 py-3">
                <dt className="w-28 shrink-0 text-gray-500 sm:w-32">{spec.label}</dt>
                <dd className="font-medium text-gray-800">{spec.value}</dd>
              </div>
            ))}
          </dl>

          {/* Jumlah & aksi */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-gray-700">Jumlah</p>
            <QuantitySelector
              value={qty}
              max={product.stock}
              label={product.name}
              onDecrease={() => setQty((q) => Math.max(1, q - 1))}
              onIncrease={() => setQty((q) => Math.min(product.stock, q + 1))}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => addToCart(product, qty)}
              disabled={outOfStock}
              className="btn-outline flex-1 py-3"
            >
              <CartIcon className="h-5 w-5" />
              Tambah ke Keranjang
            </button>
            <button type="button" onClick={handleBuyNow} disabled={outOfStock} className="btn-primary flex-1 py-3">
              Beli Sekarang
            </button>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-3">
              <TruckIcon className="h-5 w-5 shrink-0 text-emerald-600" />
              Estimasi tiba 2-4 hari kerja. Gratis ongkir untuk belanja min. Rp 300.000.
            </li>
            <li className="flex items-center gap-3">
              <ShieldIcon className="h-5 w-5 shrink-0 text-emerald-600" />
              Tukar produk dalam 7 hari jika cacat produksi.
            </li>
          </ul>
        </div>
      </div>

      {/* Produk serupa */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-extrabold text-gray-900 sm:text-2xl">Produk Serupa</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
