import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, products } from '../../data/products'
import ProductCard from '../../components/ProductCard'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'

const priceRanges = [
  { value: 'all', label: 'Semua harga', test: () => true },
  { value: 'under100', label: 'Di bawah Rp 100.000', test: (price) => price < 100000 },
  { value: '100to250', label: 'Rp 100.000 - Rp 250.000', test: (price) => price >= 100000 && price <= 250000 },
  { value: 'over250', label: 'Di atas Rp 250.000', test: (price) => price > 250000 },
]

const sortOptions = [
  { value: 'default', label: 'Paling Relevan' },
  { value: 'price-asc', label: 'Harga Terendah' },
  { value: 'price-desc', label: 'Harga Tertinggi' },
  { value: 'rating', label: 'Rating Tertinggi' },
]

export default function Products() {
  // Filter disimpan di URL (?q=rak&category=Dapur) agar bisa di-share dan tombol Back tetap bekerja
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const query = searchParams.get('q') ?? ''
  const categoryParam = searchParams.get('category') ?? ''
  const category = categories.some((c) => c.name === categoryParam) ? categoryParam : ''
  const priceKey = priceRanges.some((r) => r.value === searchParams.get('price')) ? searchParams.get('price') : 'all'
  const sortKey = sortOptions.some((s) => s.value === searchParams.get('sort')) ? searchParams.get('sort') : 'default'

  const updateParam = (key, value, defaultValue = '') => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === defaultValue) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  const resetFilters = () => setSearchParams({}, { replace: true })

  const hasActiveFilter = Boolean(query || category || priceKey !== 'all' || sortKey !== 'default')

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase()
    const range = priceRanges.find((r) => r.value === priceKey)

    const result = products.filter((product) => {
      const matchSearch =
        !term || product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
      const matchCategory = !category || product.category === category
      return matchSearch && matchCategory && range.test(product.price)
    })

    if (sortKey === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sortKey === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sortKey === 'rating') result.sort((a, b) => b.rating - a.rating)

    return result
  }, [query, category, priceKey, sortKey])

  const chipClass = (active) =>
    `shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition ${
      active
        ? 'border-emerald-600 bg-emerald-600 text-white'
        : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-700'
    }`

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Semua Produk</h1>
        <p className="mt-1 text-sm text-gray-500">Cari dan pilih kebutuhan rumah tanggamu.</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex gap-3">
          <SearchBar
            id="products-search"
            value={query}
            onChange={(value) => updateParam('q', value)}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className="btn-soft sm:hidden"
          >
            Filter
          </button>
        </div>

        {/* Kategori */}
        <div
          role="group"
          aria-label="Filter kategori"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible"
        >
          <button
            type="button"
            onClick={() => updateParam('category', '')}
            aria-pressed={category === ''}
            className={chipClass(category === '')}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => updateParam('category', c.name)}
              aria-pressed={category === c.name}
              className={chipClass(category === c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Harga & urutan (disembunyikan di mobile sampai tombol Filter ditekan) */}
        <div className={`${filtersOpen ? 'grid' : 'hidden'} gap-3 sm:grid sm:grid-cols-2 lg:max-w-2xl`}>
          <div>
            <label htmlFor="filter-price" className="mb-1.5 block text-xs font-semibold text-gray-500">
              Rentang harga
            </label>
            <select
              id="filter-price"
              value={priceKey}
              onChange={(event) => updateParam('price', event.target.value, 'all')}
              className="input cursor-pointer"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-sort" className="mb-1.5 block text-xs font-semibold text-gray-500">
              Urutkan
            </label>
            <select
              id="filter-sort"
              value={sortKey}
              onChange={(event) => updateParam('sort', event.target.value, 'default')}
              className="input cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600" role="status" aria-live="polite">
          Menampilkan <span className="font-bold text-gray-900">{visibleProducts.length}</span> dari {products.length}{' '}
          produk
          {query && (
            <>
              {' '}
              untuk &ldquo;<span className="font-semibold">{query}</span>&rdquo;
            </>
          )}
        </p>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="cursor-pointer text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            Reset filter
          </button>
        )}
      </div>

      {visibleProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          emoji="🔍"
          title="Produk tidak ditemukan"
          description="Coba kata kunci lain, ganti kategori, atau longgarkan rentang harga."
          actionLabel="Reset Filter"
          onAction={resetFilters}
        />
      )}
    </div>
  )
}
