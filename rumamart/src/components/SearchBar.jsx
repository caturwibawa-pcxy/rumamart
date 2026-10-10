import { SearchIcon } from './Icons'

// Search bar yang dipakai di Navbar (navigasi ke /products) dan halaman Products (filter langsung).
export default function SearchBar({
  id,
  value,
  onChange,
  onSubmit,
  placeholder = 'Cari produk rumah tangga...',
  className = '',
  autoFocus = false,
}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Cari produk
      </label>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="input pl-11"
      />
    </form>
  )
}
