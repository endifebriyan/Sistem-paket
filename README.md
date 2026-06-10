# Sistem Manajemen Paket

Aplikasi web untuk mencatat dan mengelola status penerimaan dan pengambilan paket. Dibangun menggunakan React, Vite, TypeScript, dan Tailwind CSS.

## 📋 Persyaratan Sistem

Sebelum menjalankan proyek ini, pastikan sistem Anda sudah terinstal:
- [Node.js](https://nodejs.org/en) (Versi 18 atau yang lebih baru disarankan)
- npm (Sudah termasuk dalam instalasi Node.js)

## 🚀 Cara Menjalankan Proyek Secara Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di komputer Anda:

### 1. Buka Terminal / Command Prompt
Buka terminal dan arahkan ke dalam direktori proyek ini (folder `Sistem-paket`):
```bash
cd "c:\Users\BISMILLAH\Desktop\Sistem Paket\Sistem-paket"
```
*(Atau Anda bisa langsung membuka folder ini di VS Code, lalu buka terminal terintegrasi dengan menekan \`Ctrl + \`\` )*

### 2. Instal Dependensi
Jalankan perintah berikut untuk mengunduh semua pustaka (library) yang dibutuhkan aplikasi:
```bash
npm install
```
*(Catatan: Jika Anda menggunakan Windows PowerShell dan mengalami kendala terkait "Execution Policy" saat menjalankan `npm`, Anda bisa menggunakan `cmd.exe /c npm install` atau ubah pengaturan policy PowerShell Anda).*

### 3. Jalankan Server Pengembangan (Dev Server)
Setelah instalasi selesai, jalankan perintah ini untuk memulai aplikasi:
```bash
npm run dev
```

### 4. Buka di Browser
Jika berhasil, terminal akan menampilkan URL lokal (biasanya `http://localhost:5173`).
Buka browser Anda (Chrome/Edge/Firefox) dan kunjungi tautan tersebut. Aplikasi Sistem Manajemen Paket Anda sudah siap digunakan! 🎉

---

## 🛠️ Perintah Lainnya

- **Build untuk Produksi:**
  Jika Anda ingin mengubah kode menjadi file statis siap rilis (production), jalankan:
  ```bash
  npm run build
  ```
- **Pemeriksaan Tipe (Typecheck):**
  Untuk memeriksa apakah ada kesalahan tipe TypeScript pada kode:
  ```bash
  npm run typecheck
  ```

## 📦 Fitur Aplikasi
- **Dashboard**: Melihat statistik jumlah paket masuk dan yang sudah diambil.
- **Input Paket**: Mencatat paket baru (termasuk unggah foto paket).
- **Manajemen Status**: Mencari paket, melihat detail (termasuk review foto), mengubah status dari "Menunggu" menjadi "Diambil", serta menghapus data.
- **Laporan**: Melihat riwayat pengelolaan paket secara keseluruhan.
