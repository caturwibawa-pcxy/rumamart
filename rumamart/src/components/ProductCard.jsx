import { Link } from 'react-router-dom'
import { formatRupiah } from '../utils/format'
import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'
import Rating from './Rating'
import { CartIcon } from './Icons'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const outOfStock = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 10

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <Link
        to={`/product/${product.id}`}
        aria-label={`Lihat detail ${product.name}`}
        className="relative block overflow-hidden"
      >
        <ProductImage
          product={product}
          className="aspect-square w-full transition duration-300 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
            Baru
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">{product.category}</span>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold text-gray-900 sm:text-base">{product.name}</h3>
        <Rating value={product.rating} reviews={product.reviews} className="mt-2" />
        <p className="mt-3 text-lg font-extrabold text-emerald-700">{formatRupiah(product.price)}</p>
        <p className={`mt-1 text-xs ${lowStock ? 'font-semibold text-amber-600' : 'text-gray-400'}`}>
          {outOfStock ? 'Stok habis' : lowStock ? `Stok tinggal ${product.stock}` : `Stok ${product.stock}`}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Link to={`/product/${product.id}`} className="btn-outline">
            Lihat Detail
          </Link>
          <button type="button" onClick={() => addToCart(product)} disabled={outOfStock} className="btn-primary">
            <CartIcon className="h-4 w-4" />
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </article>
  )
}
