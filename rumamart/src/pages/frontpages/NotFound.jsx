import EmptyState from '../../components/EmptyState'

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <EmptyState
        emoji="🧭"
        title="Halaman tidak ditemukan"
        description="Alamat yang kamu tuju tidak tersedia. Yuk kembali ke beranda dan lanjut belanja."
        actionLabel="Kembali ke Beranda"
        actionTo="/"
      />
    </div>
  )
}
