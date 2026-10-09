# Warung Bang Kobra — Status Studio AI 🐍🍹

Aplikasi web modern untuk membuat status dan poster promosi produk warung secara otomatis, profesional, dan siap dibagikan ke WhatsApp Status, Instagram Story, serta Facebook.

---

## 🌟 Fitur Utama

- **🚀 Pembuat Status Otomatis (1-Klik)**: Pilih menu, unggah foto produk dari galeri HP, tentukan gaya, dan biarkan AI meracik poster promosi beresolusi tinggi beserta kata-kata penarik pembeli.
- **🎨 12 Gaya Desain Visual Profesional**:
  1. *Premium Luxury* (Hitam obsidian & aksen emas)
  2. *Modern Minimalis* (Bersih & elegan)
  3. *Cafe Gen-Z* (Pop-art pastel & playful)
  4. *Promo Viral* (Oranye menyala & kontras tinggi)
  5. *Colorful Fresh* (Buah tropis segar)
  6. *Dark Elegant* (Lounge kafe malam)
  7. *Neon Glow* (Lampu neon cyber elektrik)
  8. *Korean Cafe* (Hangat & kayu estetik)
  9. *Street Food* (Autentik warung nusantara)
  10. *Diskon Besar* (Pita sale heboh)
  11. *Estetik Instagram* (Format editorial polaroid)
  12. *Premium Product Photography* (Sorotan spotlight studio)
- **🤖 AI Image Generator**:
  - Hasilkan gambar promosi produk dari prompt teks.
  - Edit foto produk dari galeri HP.
  - Ganti background menjadi podium studio, obsidian, atau kafe Korea.
  - Efek embun (*water droplets*) dan es batu kristal.
- **✍️ AI Copywriting Studio**:
  - 7 variasi gaya bahasa: *Singkat & Viral*, *Lucu & Menghibur*, *Anak Gaul Gen-Z*, *Promo Spesial*, *Persuasif*, *Santai & Ramah*, dan *Kualitas Premium*.
  - Salin langsung ke status WhatsApp.
- **📱 Format Otomatis Media Sosial**:
  - WhatsApp Status (1080 × 1920 px)
  - Instagram Story (1080 × 1920 px)
  - Facebook Story (1080 × 1920 px)
  - Feed Instagram Persegi (1080 × 1080 px)
  - Feed Potret (1080 × 1350 px)
  - Poster Produk / Brosur (1080 × 1440 px)
- **📋 Database Menu Warung Bang Kobra**:
  - 23 menu bawaan (Jus Mangga, Jus Alpukat, Thai Tea, Dalgona Coffee, Kopi Gula Aren, Pop Ice, Nutrisari, Susu Soda, dll).
  - Tambah, edit harga kapan saja, upload foto asli, dan filter kategori.
- **☁️ Penyimpanan Cloud Firebase**:
  - Terintegrasi dengan Cloud Firestore dan Firebase Auth (Google Sign-In) serta offline fallback.

---

## 🛠️ Teknologi

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, TypeScript (TSX)
- **AI**: Google GenAI SDK (`@google/genai`) — Gemini 3.8 Flash & Gemini 3.1 Flash Lite Image
- **Database & Auth**: Google Cloud Firestore & Firebase Authentication

---

## 🚀 Menjalankan Secara Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/aslinsaputra1-star/app_status.git
   cd app_status
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi `GEMINI_API_KEY` dari Google AI Studio.

4. **Jalankan aplikasi (Development)**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

5. **Build untuk Produksi**:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 Lisensi

Apache-2.0 © Warung Bang Kobra.
