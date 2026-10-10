import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatRupiah } from '../../utils/format'
import EmptyState from '../../components/EmptyState'
import ProductImage from '../../components/ProductImage'
import { CheckIcon } from '../../components/Icons'

const paymentMethods = [
  {
    value: 'transfer',
    label: 'Transfer Bank',
    hint: 'Transfer ke rekening virtual (simulasi)',
    after: 'Instruksi transfer akan dikirim ke nomor teleponmu (simulasi).',
  },
  {
    value: 'ewallet',
    label: 'E-Wallet',
    hint: 'OVO, GoPay, atau DANA (simulasi)',
    after: 'Tautan pembayaran e-wallet akan dikirim ke nomor teleponmu (simulasi).',
  },
  {
    value: 'cod',
    label: 'COD',
    hint: 'Bayar tunai saat pesanan tiba',
    after: 'Siapkan uang pas saat pesanan tiba.',
  },
]

const initialForm = {
  name: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  payment: 'transfer',
}

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 3) {
    errors.name = 'Nama lengkap minimal 3 karakter.'
  }
  if (!/^(\+62|62|0)8[0-9]{8,12}$/.test(values.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Gunakan nomor HP Indonesia, contoh: 081234567890.'
  }
  if (values.address.trim().length < 10) {
    errors.address = 'Alamat terlalu singkat. Tulis nama jalan dan nomor rumah.'
  }
  if (!values.city.trim()) {
    errors.city = 'Kota wajib diisi.'
  }
  if (!/^\d{5}$/.test(values.postalCode)) {
    errors.postalCode = 'Kode pos terdiri dari 5 angka.'
  }
  return errors
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Checkout() {
  const { items, totalItems, subtotal, shippingCost, grandTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [order, setOrder] = useState(null)

  // Saat modal sukses tampil: kunci scroll & izinkan tombol Esc untuk menutup
  useEffect(() => {
    if (!order) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [order, navigate])

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)

    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }

    const method = paymentMethods.find((m) => m.value === form.payment)
    setOrder({
      number: `RM-${Date.now().toString().slice(-8)}`,
      name: form.name.trim(),
      itemCount: totalItems,
      total: grandTotal,
      paymentLabel: method.label,
      paymentAfter: method.after,
    })
    clearCart()
  }

  // Konfirmasi pesanan berhasil (modal)
  if (order) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-title"
          className="animate-pop-in w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-xl sm:p-8"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckIcon className="h-8 w-8" />
          </div>
          <h2 id="order-success-title" className="mt-5 text-2xl font-extrabold text-gray-900">
            Pesanan berhasil dibuat!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Terima kasih, {order.name}. {order.paymentAfter}
          </p>

          <dl className="mt-6 space-y-2 rounded-2xl bg-cream-50 p-4 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Nomor pesanan</dt>
              <dd className="font-bold text-gray-900">{order.number}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Jumlah item</dt>
              <dd className="font-semibold text-gray-900">{order.itemCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Pembayaran</dt>
              <dd className="font-semibold text-gray-900">{order.paymentLabel}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-cream-200 pt-2">
              <dt className="font-bold text-gray-900">Total</dt>
              <dd className="font-extrabold text-emerald-700">{formatRupiah(order.total)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="btn-outline flex-1">
              Lanjut Belanja
            </Link>
            <Link to="/" className="btn-primary flex-1" autoFocus>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          emoji="🛒"
          title="Keranjang kamu masih kosong."
          description="Tambahkan produk dulu sebelum melanjutkan ke checkout."
          actionLabel="Mulai Belanja"
          actionTo="/products"
        />
      </div>
    )
  }

  const inputClass = (key) =>
    `input ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`

  const fieldProps = (key) => ({
    id: `field-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `field-${key}-error` : undefined,
  })

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-gray-500">Lengkapi data pengiriman dan pilih metode pembayaran.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="space-y-6 lg:col-span-2">
          {/* Data pengiriman */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">Data Pengiriman</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id="field-name" label="Nama lengkap" error={errors.name}>
                  <input
                    {...fieldProps('name')}
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => setField('name', event.target.value)}
                    placeholder="Contoh: Siti Aminah"
                    className={inputClass('name')}
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field id="field-phone" label="Nomor telepon" error={errors.phone} hint="Contoh: 081234567890">
                  <input
                    {...fieldProps('phone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) => setField('phone', event.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className={inputClass('phone')}
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field id="field-address" label="Alamat" error={errors.address}>
                  <textarea
                    {...fieldProps('address')}
                    rows={3}
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(event) => setField('address', event.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                    className={inputClass('address')}
                  />
                </Field>
              </div>

              <Field id="field-city" label="Kota" error={errors.city}>
                <input
                  {...fieldProps('city')}
                  type="text"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(event) => setField('city', event.target.value)}
                  placeholder="Contoh: Bandung"
                  className={inputClass('city')}
                />
              </Field>

              <Field id="field-postalCode" label="Kode pos" error={errors.postalCode}>
                <input
                  {...fieldProps('postalCode')}
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={form.postalCode}
                  onChange={(event) => setField('postalCode', event.target.value.replace(/\D/g, ''))}
                  placeholder="40123"
                  className={inputClass('postalCode')}
                />
              </Field>
            </div>
          </section>

          {/* Metode pembayaran */}
          <fieldset className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <legend className="-ml-1 px-1 text-lg font-bold text-gray-900">Metode Pembayaran</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {paymentMethods.map((method) => {
                const selected = form.payment === method.value
                return (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                      selected ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={selected}
                      onChange={() => setField('payment', method.value)}
                      className="mt-1 h-4 w-4 shrink-0 accent-emerald-600"
                    />
                    <span>
                      <span className="block text-sm font-bold text-gray-900">{method.label}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">{method.hint}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </div>

        {/* Ringkasan pesanan */}
        <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-gray-900">Ringkasan Pesanan</h2>

          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <ProductImage product={item} className="h-14 w-14 shrink-0 rounded-lg" emojiSize="text-2xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.qty} x {formatRupiah(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900">{formatRupiah(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal ({totalItems} item)</dt>
              <dd className="font-semibold text-gray-900">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Ongkos kirim</dt>
              <dd className="font-semibold text-gray-900">{shippingCost === 0 ? 'Gratis' : formatRupiah(shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
              <dt className="font-bold text-gray-900">Total pembayaran</dt>
              <dd className="font-extrabold text-emerald-700">{formatRupiah(grandTotal)}</dd>
            </div>
          </dl>

          <button type="submit" className="btn-primary mt-5 w-full py-3">
            Pesan Sekarang
          </button>
          <Link to="/cart" className="mt-3 block text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Kembali ke keranjang
          </Link>
          <p className="mt-4 text-center text-xs text-gray-400">
            Simulasi untuk tugas kuliah. Tidak ada pembayaran sungguhan.
          </p>
        </aside>
      </form>
    </div>
  )
}
