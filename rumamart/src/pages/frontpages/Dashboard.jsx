import { Link } from 'react-router-dom'
import { categories, products } from '../../data/products'
import CategoryCard from '../../components/CategoryCard'
import ProductCard from '../../components/ProductCard'
import ProductImage from '../../components/ProductImage'
import { ArrowRightIcon, ShieldIcon, TagIcon, TruckIcon } from '../../components/Icons'

const trustItems = [
  { icon: TruckIcon, title: 'Gratis ongkir', text: 'Untuk belanja min. Rp 300.000' },
  { icon: ShieldIcon, title: 'Kualitas terjamin', text: 'Produk dipilih dan dicek dulu' },
  { icon: TagIcon, title: 'Harga terjangkau', text: 'Hemat untuk kebutuhan harian' },
]

function SectionHeader({ title, subtitle, to }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          Lihat semua
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export default function Dashboard() {
  // Produk unggulan: yang ditandai featured, diurutkan berdasarkan rating
  const featuredProducts = products
    .filter((p) => p.featured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)

  // Produk terbaru: yang ditandai isNew, id terbesar lebih dulu
  const newProducts = products
    .filter((p) => p.isNew)
    .sort((a, b) => b.id - a.id)
    .slice(0, 4)

  // Produk untuk dekorasi hero
  const heroProducts = [13, 11, 2, 10].map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return (
    <div>
      {/* Hero */}
      <section className="container-page pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-cream-100">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/50" aria-hidden="true" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-cream-200" aria-hidden="true" />

          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-14">
            <div>
              <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                Solusi Lengkap untuk Rumah Nyaman
              </span>
              <h1 className="mt-5 text-3xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Lengkapi Rumahmu, Mulai dari <span className="text-emerald-600">RumaMart</span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600">
                Temukan berbagai kebutuhan rumah tangga berkualitas dengan harga terjangkau.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/products" className="btn-primary px-7 py-3 text-base">
                  Belanja Sekarang
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <a href="#kategori" className="btn-soft bg-white px-7 py-3 text-base hover:bg-cream-50">
                  Lihat Kategori
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className={`group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md ${
                    index % 2 === 1 ? 'translate-y-4' : ''
                  }`}
                >
                  <ProductImage
                    product={product}
                    className="aspect-square w-full transition duration-300 group-hover:scale-105"
                    emojiSize="text-5xl"
                  />
                  <p className="truncate px-3 py-2 text-xs font-semibold text-gray-700">{product.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info singkat */}
      <section className="container-page mt-10" aria-label="Keunggulan RumaMart">
        <ul className="grid gap-3 sm:grid-cols-3">
          {trustItems.map(({ icon: TrustIcon, title, text }) => (
            <li key={title} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <TrustIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Kategori */}
      <section id="kategori" className="container-page mt-14 scroll-mt-24">
        <SectionHeader title="Belanja per Kategori" subtitle="Pilih kebutuhan rumahmu" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              count={products.filter((p) => p.category === category.name).length}
            />
          ))}
        </div>
      </section>

      {/* Produk unggulan */}
      <section className="container-page mt-14">
        <SectionHeader title="Produk Unggulan" subtitle="Favorit pelanggan dengan rating terbaik" to="/products" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Produk terbaru */}
      <section className="container-page mt-14">
        <SectionHeader title="Produk Terbaru" subtitle="Baru hadir di RumaMart" to="/products" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
