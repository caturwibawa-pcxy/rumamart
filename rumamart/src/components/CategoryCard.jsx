import { Link } from 'react-router-dom'

export default function CategoryCard({ category, count }) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
    >
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${category.tint} text-3xl transition duration-200 group-hover:scale-110`}
        aria-hidden="true"
      >
        {category.emoji}
      </span>
      <h3 className="mt-3 text-sm font-bold text-gray-900 sm:text-base">{category.name}</h3>
      <p className="mt-0.5 text-xs text-gray-500">{count} produk</p>
    </Link>
  )
}
