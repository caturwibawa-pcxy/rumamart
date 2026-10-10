import { Link } from 'react-router-dom'
import { categories } from '../data/products'
import { HomeIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-cream-200 bg-cream-50">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <HomeIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              Ruma<span className="text-emerald-600">Mart</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-600">
            Solusi Lengkap untuk Rumah Nyaman. Kebutuhan dapur, kebersihan, penyimpanan, dekorasi, kamar tidur, dan
            kamar mandi dalam satu tempat.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">Kategori</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="transition hover:text-emerald-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">Belanja</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <Link to="/products" className="transition hover:text-emerald-700">
                Semua Produk
              </Link>
            </li>
            <li>
              <Link to="/cart" className="transition hover:text-emerald-700">
                Keranjang
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="transition hover:text-emerald-700">
                Checkout
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">Gratis ongkir untuk belanja min. Rp 300.000.</p>
        </div>
      </div>

      <div className="border-t border-cream-200">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} RumaMart. Hak cipta dilindungi.</p>
          <p>Project tugas mata kuliah Frontend Programming. Tidak ada transaksi sungguhan.</p>
        </div>
      </div>
    </footer>
  )
}
