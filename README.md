# Ainov

Agen penulis pribadi yang berdiri sendiri di Vercel. Website pribadi dan aplikasi
laptop nantinya memakai API Ainov yang sama.

## Tahap 1 — ruang menulis

- Kerangka Next.js + Eve dan instruksi penulis tersedia.
- Proyek Vercel `ainov` dibuat pada 30 Oktober 2026.
- Proteksi SSO Vercel aktif untuk deployment (kecuali domain khusus).
- Model awal: `openai/gpt-6.1-sol-fast` melalui AI Gateway.
- UI ruang menulis, percakapan, dan panel akses pribadi sudah dibuat.
- Akses agen ditutup sampai `AINOV_USERNAME` dan `AINOV_PASSWORD` diatur pada
  Environment Variables Vercel.
- Repositori GitHub publik `bawaslu-bintan/ainov` tertaut ke proyek Vercel
  `ainov`; branch produksi adalah `main`.
- Build pertama gagal saat instalasi karena Eve mensyaratkan AI SDK `^7.0.137`;
  dependensi langsung sudah disesuaikan. Belum ada deployment yang berhasil.
- Versi paket langsung dipatok di `package.json`; lockfile dan build lokal belum
  dapat dibuat karena registry npm dari lingkungan ini tidak terjangkau.

## Menjalankan

Gunakan Node.js 24, isi `.env.local` dari `.env.example`, lalu jalankan
`npm install` dan `npm run dev`. Deployment produksi memakai Environment
Variables di Vercel; jangan simpan password ke Git.

## Ukuran penyelesaian tahap 1

1. Login pribadi berhasil dan permintaan tanpa kredensial ditolak.
2. Ainov menerima ide/brief dan menghasilkan draf dalam Bahasa Indonesia.
3. Ainov merevisi draf sambil menjaga konteks percakapan.
4. Balasan streaming dan status gagal terlihat di UI.

## Tahap berikutnya

1. Selesaikan konfigurasi akses/model di Vercel dan pastikan deployment dari `main` berhasil.
2. Simpan daftar sesi, profil gaya, draf, dan versi tulisan.
3. Tambahkan monitor penggunaan dan API untuk website pribadi.
4. Tambahkan klien laptop.

Lihat `agent/instructions.md` untuk aturan penulisan Ainov.

