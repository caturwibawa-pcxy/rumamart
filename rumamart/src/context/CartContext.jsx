import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'rumamart-cart'

// Aturan ongkos kirim (simulasi)
export const SHIPPING_FEE = 15000
export const FREE_SHIPPING_MIN = 300000

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [notice, setNotice] = useState(null)

  // Simpan keranjang agar tidak hilang saat halaman di-refresh
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // abaikan jika localStorage tidak tersedia
    }
  }, [items])

  const showNotice = useCallback((data) => {
    setNotice({ id: Date.now() + Math.random(), type: 'success', ...data })
  }, [])

  const dismissNotice = useCallback(() => setNotice(null), [])

  const addToCart = useCallback(
    (product, qty = 1, { silent = false } = {}) => {
      const existing = items.find((item) => item.id === product.id)
      const currentQty = existing ? existing.qty : 0
      const nextQty = Math.min(currentQty + qty, product.stock)

      if (nextQty === currentQty) {
        showNotice({
          type: 'warning',
          message: `Stok ${product.name} tinggal ${product.stock}, semuanya sudah ada di keranjangmu.`,
        })
        return false
      }

      setItems((prev) => {
        if (prev.some((item) => item.id === product.id)) {
          return prev.map((item) => (item.id === product.id ? { ...item, qty: nextQty } : item))
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            emoji: product.emoji,
            stock: product.stock,
            qty: nextQty,
          },
        ]
      })

      if (!silent) {
        showNotice({
          type: 'success',
          message:
            nextQty < currentQty + qty
              ? `Jumlah disesuaikan dengan stok. ${product.name} ada ${nextQty} di keranjang.`
              : `${product.name} ditambahkan ke keranjang.`,
        })
      }
      return true
    },
    [items, showNotice],
  )

  const increaseQty = useCallback(
    (id) => {
      const item = items.find((i) => i.id === id)
      if (!item) return
      if (item.qty >= item.stock) {
        showNotice({ type: 'warning', message: `Stok maksimal ${item.name} adalah ${item.stock}.` })
        return
      }
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)))
    },
    [items, showNotice],
  )

  const decreaseQty = useCallback((id) => {
    setItems((prev) => prev.map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i)))
  }, [])

  // Hapus item, dengan opsi "Urungkan" (Golden Rule: permit easy reversal of actions)
  const removeFromCart = useCallback(
    (id) => {
      const index = items.findIndex((i) => i.id === id)
      if (index === -1) return
      const removed = items[index]

      setItems((prev) => prev.filter((i) => i.id !== id))
      showNotice({
        type: 'info',
        message: `${removed.name} dihapus dari keranjang.`,
        actionLabel: 'Urungkan',
        onAction: () =>
          setItems((prev) => {
            if (prev.some((i) => i.id === removed.id)) return prev
            const next = [...prev]
            next.splice(Math.min(index, next.length), 0, removed)
            return next
          }),
      })
    },
    [items, showNotice],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])
  const shippingCost = items.length === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE
  const grandTotal = subtotal + shippingCost

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      shippingCost,
      grandTotal,
      notice,
      addToCart,
      increaseQty,
      decreaseQty,
      removeFromCart,
      clearCart,
      dismissNotice,
    }),
    [
      items,
      totalItems,
      subtotal,
      shippingCost,
      grandTotal,
      notice,
      addToCart,
      increaseQty,
      decreaseQty,
      removeFromCart,
      clearCart,
      dismissNotice,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart harus dipakai di dalam <CartProvider>')
  }
  return context
}
