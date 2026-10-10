// Format angka menjadi Rupiah, contoh: 125000 -> "Rp 125.000"
export function formatRupiah(value) {
  const rounded = Math.round(Number(value) || 0)
  return 'Rp ' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
