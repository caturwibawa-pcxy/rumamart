import { useState } from 'react'
import { getCategory } from '../data/products'

// Menampilkan foto produk. Jika foto belum ada / gagal dimuat,
// tampilkan ilustrasi emoji dengan warna sesuai kategori.
export default function ProductImage({ product, className = '', emojiSize = 'text-6xl' }) {
  const [failed, setFailed] = useState(false)
  const category = getCategory(product.category)

  if (!product.image || failed) {
    return (
      <div
        role="img"
        aria-label={product.name}
        className={`flex items-center justify-center bg-linear-to-br ${category.tint} ${className}`}
      >
        <span className={emojiSize} aria-hidden="true">
          {product.emoji}
        </span>
      </div>
    )
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}
