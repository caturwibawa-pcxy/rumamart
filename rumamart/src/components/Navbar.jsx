import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import SearchBar from './SearchBar'
import { CartIcon, CloseIcon, HomeIcon, MenuIcon, SearchIcon } from './Icons'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart' },
  { to: '/checkout', label: 'Checkout' },
]

const desktopLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

const mobileLinkClass = ({ isActive }) =>
  `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'
  }`

export default function Navbar() {
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  // Tutup menu & search mobile setiap berpindah halaman
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  const handleSearch = (term) => {
    const q = term.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="RumaMart, ke beranda">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <HomeIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            Ruma<span className="text-emerald-600">Mart</span>
          </span>
        </Link>

        {/* Menu desktop */}
        <nav aria-label="Navigasi utama" className="ml-4 hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Search bar desktop */}
        <SearchBar
          id="navbar-search-desktop"
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          className="ml-auto hidden w-full max-w-xs lg:block xl:max-w-sm"
        />

        {/* Aksi kanan */}
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((open) => !open)
              setMenuOpen(false)
            }}
            aria-label="Buka pencarian"
            aria-expanded={searchOpen}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 lg:hidden"
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          <Link
            to="/cart"
            aria-label={`Keranjang belanja, ${totalItems} item`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100"
          >
            <CartIcon className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open)
              setSearchOpen(false)
            }}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 lg:hidden"
          >
            {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Search mobile */}
      {searchOpen && (
        <div className="container-page animate-pop-in pb-3 lg:hidden">
          <SearchBar
            id="navbar-search-mobile"
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            autoFocus
          />
        </div>
      )}

      {/* Menu mobile (hamburger) */}
      {menuOpen && (
        <nav aria-label="Navigasi mobile" className="container-page animate-pop-in space-y-1 pb-4 lg:hidden">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={mobileLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
