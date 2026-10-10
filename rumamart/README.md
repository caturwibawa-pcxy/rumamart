# RumaMart

**Solusi Lengkap untuk Rumah Nyaman**

RumaMart adalah website e-commerce sederhana untuk kebutuhan rumah tangga (dapur, kebersihan,
penyimpanan, dekorasi, kamar tidur, dan kamar mandi). Project ini dibuat untuk tugas mata kuliah
**Frontend Programming** dengan fokus pada konsep Single Page Application (SPA), component-based
architecture, dan responsive web design.

## Teknologi

- React JS (JSX, tanpa TypeScript)
- Vite
- Tailwind CSS v4
- React Router DOM
- Context API (state keranjang) + `useState` / `useEffect`
- Data produk statis (tanpa backend/database)

## Cara menjalankan

Syarat: Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya http://localhost:5173).

Perintah lain:

```bash
npm run build     # build produksi ke folder dist/
npm run preview   # coba hasil build
```

## Halaman dan route

| Route           | File                                     | Isi                                                      |
| --------------- | ---------------------------------------- | -------------------------------------------------------- |
| `/`             | `pages/frontpages/Dashboard.jsx`         | Hero, kategori, produk unggulan, produk terbaru          |
| `/products`     | `pages/frontpages/Products.jsx`          | Grid produk, search, filter kategori & harga, sorting    |
| `/product/:id`  | `pages/frontpages/ProductDetail.jsx`     | Detail produk, pilih jumlah, tambah ke keranjang, beli   |
| `/cart`         | `pages/frontpages/Cart.jsx`              | Daftar item, ubah jumlah, hapus, subtotal & total        |
| `/checkout`     | `pages/frontpages/Checkout.jsx`          | Form pengiriman, metode pembayaran, ringkasan, konfirmasi |
| `*`             | `pages/frontpages/NotFound.jsx`          | Halaman 404                                              |

## Struktur folder

```text
src/
├── main.jsx                  # entry: BrowserRouter + CartProvider
├── App.jsx                   # definisi route
├── index.css                 # Tailwind + tema warna + class tombol/input
├── layouts/
│   └── MainLayout.jsx        # Navbar + <Outlet /> + Footer + Toast
├── components/               # komponen reusable
│   ├── Navbar.jsx            ├── Footer.jsx
│   ├── ProductCard.jsx       ├── CategoryCard.jsx
│   ├── SearchBar.jsx         ├── CartItem.jsx
│   ├── QuantitySelector.jsx  ├── Rating.jsx
│   ├── ProductImage.jsx      ├── EmptyState.jsx
│   ├── Toast.jsx             └── Icons.jsx
├── pages/frontpages/         # 5 halaman utama + NotFound
├── data/products.js          # 18 produk + 6 kategori
├── context/CartContext.jsx   # state keranjang (Context API)
└── utils/format.js           # formatRupiah()
```

## Konsep yang diterapkan

- **SPA + React Router**: perpindahan halaman memakai `<Link>` / `<NavLink>` sehingga tidak ada full page reload.
- **MainLayout**: semua halaman dibungkus `MainLayout` lewat nested route dan `<Outlet />`.
- **Component-based architecture**: UI dipecah menjadi komponen kecil yang dipakai ulang
  (`ProductCard` dipakai di Dashboard, Products, dan Product Detail).
- **Context API**: `CartContext` menyimpan keranjang dan dipakai oleh Navbar, ProductCard, ProductDetail, Cart, dan Checkout.
  Keranjang disimpan di `localStorage` agar tidak hilang saat refresh.
- **Responsive (mobile-first)**: grid produk 1 kolom (mobile), 2 kolom (`sm`), 3 kolom (`lg`), 4 kolom (`xl`);
  navbar berubah menjadi hamburger di bawah `lg`.
- **Search & filter**: kata kunci, kategori, rentang harga, dan sorting tersimpan di URL
  (`/products?q=rak&category=Dapur`), jadi tombol Back dan link tetap bekerja.

## 8 Golden Rules (Shneiderman) pada RumaMart

| # | Prinsip | Penerapan di RumaMart |
| - | ------- | --------------------- |
| 1 | Strive for consistency | Palet emerald + cream, class tombol `btn-primary` / `btn-outline` / `btn-soft`, satu `ProductCard` untuk semua halaman, Navbar & Footer sama lewat `MainLayout`, format Rupiah seragam. |
| 2 | Cater to universal usability | Mobile-first & responsive, hamburger menu, label pada setiap field, `aria-label` pada ikon, skip link, fokus keyboard terlihat, teks Indonesia yang jelas, animasi dikurangi jika `prefers-reduced-motion`. |
| 3 | Offer informative feedback | Toast saat produk ditambah/dihapus, badge jumlah di navbar, jumlah hasil pencarian, pesan error per field, info stok ("Stok tinggal 9"), progress gratis ongkir. |
| 4 | Design dialogs to yield closure | Alur belanja jelas: produk → keranjang → checkout → modal "Pesanan berhasil dibuat!" berisi nomor pesanan dan langkah berikutnya. |
| 5 | Prevent errors | Jumlah minimal 1 dan maksimal sesuai stok, validasi nomor HP / kode pos / alamat, kode pos hanya angka, metode pembayaran terpilih secara default, checkout diblokir jika keranjang kosong. |
| 6 | Permit easy reversal of actions | Tombol **Urungkan** setelah menghapus item, tombol +/- jumlah, **Reset filter**, tombol "Kembali ke keranjang". |
| 7 | Keep users in control | Tidak ada aksi otomatis tanpa klik pengguna, filter bisa diubah/dihapus kapan saja, modal bisa ditutup dengan Esc, pengguna memutuskan kapan lanjut ke checkout. |
| 8 | Reduce short-term memory load | Breadcrumb di detail produk, badge keranjang selalu terlihat, ringkasan pesanan tampil di samping form, filter aktif ditandai, keranjang tersimpan di `localStorage`. |

## Foto produk

Data produk ada di `src/data/products.js`. Field `image` menunjuk ke `public/images/products/<nama>.jpg`.
Taruh foto produk di folder tersebut dengan nama file yang sama (lihat `public/images/products/README.md`),
atau ganti nilainya dengan URL gambar yang valid. Selama foto belum ada, kartu produk otomatis menampilkan
ilustrasi emoji sehingga tampilan tidak rusak.

## Ide alur demo saat presentasi

1. Buka Home, tunjukkan hero, kategori, dan produk unggulan.
2. Klik **Belanja Sekarang**, ketik `rak` di search, lalu coba filter kategori, harga, dan sorting.
3. Buka satu produk, ubah jumlah, klik **Tambah ke Keranjang** (perhatikan badge dan toast).
4. Buka Cart: ubah jumlah, hapus item, lalu klik **Urungkan**.
5. Lanjut ke Checkout: tekan **Pesan Sekarang** dengan form kosong (lihat validasi), lalu isi form dan selesaikan pesanan.
6. Kecilkan jendela browser untuk menunjukkan tampilan mobile dan hamburger menu.
